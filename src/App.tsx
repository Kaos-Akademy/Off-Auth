import { FormEvent, useEffect, useMemo, useState } from "react";
import { backend } from "./lib/backend";
import {
  getStoredOwnerKey,
  loginWithPasskey,
  logoutPasskey,
  registerPasskey,
} from "./lib/passkey";
import { AuthPanel } from "./components/AuthPanel";
import { CardComposer, type CardFormState } from "./components/CardComposer";
import { CardList } from "./components/CardList";
import type { CardEvent, SubscriptionCard } from "./types";

const EMPTY_FORM: CardFormState = {
  merchant: "",
  monthlyAmount: "15.99",
  months: "3",
  buffer: "0",
};

export default function App() {
  const [ownerKey, setOwnerKey] = useState<string | null>(getStoredOwnerKey());
  const [cards, setCards] = useState<SubscriptionCard[]>([]);
  const [events, setEvents] = useState<CardEvent[]>([]);
  const [form, setForm] = useState<CardFormState>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reload(key: string) {
    const [nextCards, nextEvents] = await Promise.all([
      backend.listCards(key),
      backend.listEvents(key),
    ]);
    setCards(nextCards.sort((a, b) => b.createdAt - a.createdAt));
    setEvents(nextEvents.sort((a, b) => b.createdAt - a.createdAt));
  }

  useEffect(() => {
    if (!ownerKey) return;
    void reload(ownerKey);
  }, [ownerKey]);

  const eventsByCard = useMemo(() => {
    return events.reduce<Record<string, CardEvent[]>>((acc, event) => {
      acc[event.cardId] ??= [];
      acc[event.cardId].push(event);
      return acc;
    }, {});
  }, [events]);

  async function onCreateAnonymousPasskey() {
    setError(null);
    setBusy(true);
    try {
      const key = await registerPasskey();
      setOwnerKey(key);
      await reload(key);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onPasskeyLogin() {
    setError(null);
    setBusy(true);
    try {
      const key = await loginWithPasskey();
      if (!key) throw new Error("No passkey account found. Create one first.");
      setOwnerKey(key);
      await reload(key);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onCreateCard(e: FormEvent) {
    e.preventDefault();
    if (!ownerKey) return;
    setError(null);
    setBusy(true);
    try {
      const monthlyAmount = Math.round(Number(form.monthlyAmount) * 100);
      const cycleCount = Number(form.months);
      const bufferCents = Math.round(Number(form.buffer) * 100);
      await backend.createCard({
        ownerKey,
        merchant: form.merchant.trim(),
        monthlyLimitCents: monthlyAmount,
        cycleCount,
        bufferCents,
      });
      setForm(EMPTY_FORM);
      await reload(ownerKey);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onUnsubscribe(cardId: string) {
    if (!ownerKey) return;
    setError(null);
    setBusy(true);
    try {
      await backend.unsubscribeCard(cardId, ownerKey);
      await reload(ownerKey);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!ownerKey)
    return (
      <AuthPanel
        busy={busy}
        error={error}
        onCreatePasskey={onCreateAnonymousPasskey}
        onSignIn={onPasskeyLogin}
      />
    );

  return (
    <main className="shell">
      <header className="top">
        <div>
          <h1>Subscriptions</h1>
          <p className="muted">Signed in: {ownerKey}</p>
        </div>
        <button
          className="ghost"
          onClick={() => {
            logoutPasskey();
            setOwnerKey(null);
            setCards([]);
            setEvents([]);
          }}
        >
          Log out
        </button>
      </header>

      <CardComposer busy={busy} form={form} onChange={setForm} onSubmit={onCreateCard} />
      <CardList cards={cards} eventsByCard={eventsByCard} busy={busy} onUnsubscribe={onUnsubscribe} />
      {error ? <p className="error">{error}</p> : null}
    </main>
  );
}
