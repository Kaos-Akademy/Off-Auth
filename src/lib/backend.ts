import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { CardEvent, SubscriptionCard } from "../types";

type CreateCardInput = {
  ownerKey: string;
  merchant: string;
  monthlyLimitCents: number;
  cycleCount: number;
  bufferCents: number;
};

type BackendClient = {
  listCards: (ownerKey: string) => Promise<SubscriptionCard[]>;
  listEvents: (ownerKey: string) => Promise<CardEvent[]>;
  createCard: (input: CreateCardInput) => Promise<void>;
  unsubscribeCard: (cardId: string, ownerKey: string) => Promise<void>;
};

const STORAGE_CARDS = "offauth-local-cards";
const STORAGE_EVENTS = "offauth-local-events";

function now(): number {
  return Date.now();
}

function readCards(): SubscriptionCard[] {
  return JSON.parse(localStorage.getItem(STORAGE_CARDS) ?? "[]") as SubscriptionCard[];
}

function readEvents(): CardEvent[] {
  return JSON.parse(localStorage.getItem(STORAGE_EVENTS) ?? "[]") as CardEvent[];
}

function saveCards(cards: SubscriptionCard[]): void {
  localStorage.setItem(STORAGE_CARDS, JSON.stringify(cards));
}

function saveEvents(events: CardEvent[]): void {
  localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
}

function createLocalClient(): BackendClient {
  return {
    async listCards(ownerKey) {
      return readCards().filter((card) => card.ownerKey === ownerKey);
    },
    async listEvents(ownerKey) {
      const cardIds = new Set(
        readCards()
          .filter((card) => card.ownerKey === ownerKey)
          .map((card) => card.id)
      );
      return readEvents().filter((event) => cardIds.has(event.cardId));
    },
    async createCard(input) {
      const cardId = crypto.randomUUID();
      const fundedCents = input.monthlyLimitCents * input.cycleCount + input.bufferCents;
      const card: SubscriptionCard = {
        id: cardId,
        ownerKey: input.ownerKey,
        merchant: input.merchant,
        monthlyLimitCents: input.monthlyLimitCents,
        cycleCount: input.cycleCount,
        cyclesRemaining: input.cycleCount,
        fundedCents,
        spentCents: 0,
        refundableCents: fundedCents,
        status: "active",
        createdAt: now(),
        updatedAt: now(),
      };
      const cards = readCards();
      cards.push(card);
      saveCards(cards);

      const events = readEvents();
      events.push({
        id: crypto.randomUUID(),
        cardId,
        eventType: "created",
        note: `Card created for ${input.merchant}`,
        createdAt: now(),
      });
      saveEvents(events);
    },
    async unsubscribeCard(cardId, ownerKey) {
      const cards = readCards();
      const idx = cards.findIndex((card) => card.id === cardId && card.ownerKey === ownerKey);
      if (idx < 0) {
        throw new Error("Card not found");
      }
      const current = cards[idx];
      cards[idx] = {
        ...current,
        status: "unsubscribed",
        cyclesRemaining: 0,
        refundableCents: Math.max(current.fundedCents - current.spentCents, 0),
        updatedAt: now(),
      };
      saveCards(cards);

      const events = readEvents();
      events.push(
        {
          id: crypto.randomUUID(),
          cardId,
          eventType: "unsubscribed",
          note: "Card unsubscribed and frozen",
          createdAt: now(),
        },
        {
          id: crypto.randomUUID(),
          cardId,
          eventType: "refundRequested",
          note: "Remaining funds marked for return",
          createdAt: now(),
        }
      );
      saveEvents(events);
    },
  };
}

function createConvexClient(url: string): BackendClient {
  const client = new ConvexHttpClient(url);
  return {
    async listCards(ownerKey) {
      const rows = await client.query(api.cards.listByOwner, { ownerKey });
      return rows.map((row: any) => ({
        id: row._id,
        ownerKey: row.ownerKey,
        merchant: row.merchant,
        monthlyLimitCents: row.monthlyLimitCents,
        cycleCount: row.cycleCount,
        cyclesRemaining: row.cyclesRemaining,
        fundedCents: row.fundedCents,
        spentCents: row.spentCents,
        refundableCents: row.refundableCents,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));
    },
    async listEvents(ownerKey) {
      const rows = await client.query(api.cards.listEventsByOwner, { ownerKey });
      return rows.map((row: any) => ({
        id: row._id,
        cardId: row.cardId,
        eventType: row.eventType,
        note: row.note,
        createdAt: row.createdAt,
      })) as CardEvent[];
    },
    async createCard(input) {
      await client.mutation(api.cards.create, input);
    },
    async unsubscribeCard(cardId, ownerKey) {
      await client.mutation(api.cards.unsubscribe, { cardId: cardId as Id<"cards">, ownerKey });
    },
  };
}

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
export const backend: BackendClient = convexUrl
  ? createConvexClient(convexUrl)
  : createLocalClient();
