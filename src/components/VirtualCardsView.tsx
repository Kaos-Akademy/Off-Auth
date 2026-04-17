import { FormEvent } from "react";
import type { CardFormState } from "../formTypes";
import { formatMoney } from "../lib/money";
import type { CardEvent, SubscriptionCard } from "../types";

type VirtualCardsViewProps = {
  cards: SubscriptionCard[];
  eventsByCard: Record<string, CardEvent[]>;
  form: CardFormState;
  onChange: (next: CardFormState) => void;
  onSubmit: (e: FormEvent) => void;
  busy: boolean;
  onUnsubscribe: (cardId: string) => void;
};

function initials(name: string): string {
  const p = name.trim().split(/\s+/).slice(0, 2);
  return p.map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
}

export function VirtualCardsView({
  cards,
  eventsByCard,
  form,
  onChange,
  onSubmit,
  busy,
  onUnsubscribe,
}: VirtualCardsViewProps) {
  return (
    <>
      <section className="card">
        <h2>Create vault key</h2>
        <p className="muted">Issue a merchant-locked virtual card for subscriptions or one-time use.</p>
        <div className="kind-toggle" role="group" aria-label="Card type">
          {(
            [
              ["subscription", "Subscription", "autorenew"],
              ["one_time", "One-time", "bolt"],
              ["trial", "Trial", "hourglass_bottom"],
            ] as const
          ).map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              className={form.cardKind === id ? "active" : ""}
              onClick={() => onChange({ ...form, cardKind: id })}
            >
              <span className="icon" aria-hidden>
                {icon}
              </span>
              <br />
              {label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            void onSubmit(e);
          }}
        >
          <div className="field">
            <label htmlFor="nick">Nickname</label>
            <input
              id="nick"
              className="input"
              value={form.merchant}
              onChange={(e) => onChange({ ...form, merchant: e.target.value })}
              placeholder="Netflix, Amazon…"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="limit">Spending limit ($ / month)</label>
            <input
              id="limit"
              className="input"
              type="number"
              min="0.01"
              step="0.01"
              value={form.monthlyAmount}
              onChange={(e) => onChange({ ...form, monthlyAmount: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="months">Plan length (months)</label>
            <input
              id="months"
              className="input"
              type="number"
              min="1"
              value={form.months}
              onChange={(e) => onChange({ ...form, months: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="buf">Optional buffer ($)</label>
            <input
              id="buf"
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={form.buffer}
              onChange={(e) => onChange({ ...form, buffer: e.target.value })}
            />
          </div>
          <button type="submit" className="btn" disabled={busy}>
            <span className="icon" aria-hidden>
              add_card
            </span>
            Generate virtual card
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Your virtual cards</h2>
        <div className="vcard-grid">
          {cards.map((card) => (
            <article key={card.id} className="vcard">
              <div className="vcard-head">
                <div className="avatar">{initials(card.merchant)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{card.merchant}</strong>
                  <p className="muted" style={{ margin: "4px 0 0", fontSize: "0.75rem" }}>
                    Limit {formatMoney(card.monthlyLimitCents)} / mo · {card.cyclesRemaining} cycles left
                  </p>
                </div>
                <span className={`status-dot ${card.status}`}>{card.status}</span>
              </div>
              <p className="muted" style={{ margin: "0 0 8px", fontSize: "0.75rem" }}>
                Redeemable {formatMoney(card.refundableCents)}
              </p>
              <button
                type="button"
                className="btn btn-danger"
                disabled={busy || card.status !== "active"}
                onClick={() => void onUnsubscribe(card.id)}
              >
                Unsubscribe & return {formatMoney(card.refundableCents)}
              </button>
              <ul className="list-tight" style={{ marginTop: 10 }}>
                {(eventsByCard[card.id] ?? []).slice(0, 3).map((ev) => (
                  <li key={ev.id} style={{ fontSize: "0.8rem" }}>
                    <span>{ev.eventType}</span>
                    <span className="muted">{ev.note}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
