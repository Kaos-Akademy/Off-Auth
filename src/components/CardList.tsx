import type { CardEvent, SubscriptionCard } from "../types";

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

type CardListProps = {
  cards: SubscriptionCard[];
  eventsByCard: Record<string, CardEvent[]>;
  busy: boolean;
  onUnsubscribe: (cardId: string) => Promise<void>;
};

export function CardList({ cards, eventsByCard, busy, onUnsubscribe }: CardListProps) {
  return (
    <section className="cards">
      {cards.map((card) => (
        <article className="panel" key={card.id}>
          <div className="row">
            <h3>{card.merchant}</h3>
            <span className={`status ${card.status}`}>{card.status}</span>
          </div>
          <p>
            {money(card.monthlyLimitCents)} per month, {card.cycleCount} month plan.
          </p>
          <p>
            Remaining: {money(card.refundableCents)} | Cycles left: {card.cyclesRemaining}
          </p>
          <button
            className="danger"
            disabled={busy || card.status !== "active"}
            onClick={() => {
              void onUnsubscribe(card.id);
            }}
            type="button"
          >
            Unsubscribe and return {money(card.refundableCents)}
          </button>
          <div className="timeline">
            {(eventsByCard[card.id] ?? []).slice(0, 4).map((event) => (
              <p key={event.id}>
                <strong>{event.eventType}</strong> - {event.note}
              </p>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
