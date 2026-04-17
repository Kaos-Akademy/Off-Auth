import { formatMoney } from "../lib/money";
import type { CardEvent, SubscriptionCard } from "../types";

type DashboardViewProps = {
  cards: SubscriptionCard[];
  events: CardEvent[];
};

function initials(name: string): string {
  const p = name.trim().split(/\s+/).slice(0, 2);
  return p.map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
}

export function DashboardView({ cards, events }: DashboardViewProps) {
  const active = cards.filter((c) => c.status === "active");
  const totalFunded = cards.reduce((s, c) => s + c.fundedCents, 0);
  const totalRefundable = cards.reduce((s, c) => s + c.refundableCents, 0);
  const expiringSoon = active.filter((c) => c.cyclesRemaining <= 1 && c.cyclesRemaining > 0).length;
  const recent = [...events].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  return (
    <>
      <section className="card">
        <div className="row-between">
          <div>
            <p className="muted">
              <span className="icon" aria-hidden>
                account_balance
              </span>{" "}
              Vault balance overview
            </p>
            <p className="stat-lg">{formatMoney(totalFunded)}</p>
            <p className="muted">Total funded across virtual cards</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="muted">Available to return</p>
            <p className="stat-lg" style={{ fontSize: "1.25rem" }}>
              {formatMoney(totalRefundable)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid-2">
        <section className="card">
          <p className="muted">
            <span className="icon" aria-hidden>
              analytics
            </span>{" "}
            Subscription health
          </p>
          <h2>Active plans</h2>
          <p className="muted">Merchant-locked limits protect each subscription.</p>
          {expiringSoon > 0 ? (
            <p className="pill warn" style={{ marginTop: 10 }}>
              {expiringSoon} card{expiringSoon > 1 ? "s" : ""} on final cycle
            </p>
          ) : (
            <p className="pill" style={{ marginTop: 10 }}>
              All cycles healthy
            </p>
          )}
        </section>
        <section className="card">
          <p className="muted">Quick stats</p>
          <h2>Virtual cards</h2>
          <p className="stat-lg">{active.length}</p>
          <p className="muted">Active of {cards.length} total</p>
        </section>
      </div>

      <section className="card">
        <div className="row-between">
          <h2>Active virtual cards</h2>
          <span className="muted" style={{ fontSize: "0.75rem" }}>
            Swipe on mobile
          </span>
        </div>
        <div className="scroll-x" style={{ marginTop: 12 }}>
          {cards.length === 0 ? (
            <p className="muted">No cards yet — issue one from Virtual Cards.</p>
          ) : (
            cards.slice(0, 6).map((card) => (
              <div key={card.id} className="vcard">
                <div className="vcard-head">
                  <div className="avatar">{initials(card.merchant)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: "block", fontSize: "0.95rem" }}>{card.merchant}</strong>
                    <span className={`status-dot ${card.status}`}>{card.status}</span>
                  </div>
                </div>
                <p className="muted" style={{ margin: "0 0 4px", fontSize: "0.75rem" }}>
                  LIMIT
                </p>
                <p style={{ margin: 0, fontWeight: 700 }}>{formatMoney(card.monthlyLimitCents)} / mo</p>
                <p className="muted" style={{ margin: "8px 0 0", fontSize: "0.75rem" }}>
                  Cycles left: {card.cyclesRemaining}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="card">
        <h2>Recent activity</h2>
        <ul className="list-tight">
          {recent.length === 0 ? (
            <li className="muted">No events yet.</li>
          ) : (
            recent.map((e) => (
              <li key={e.id}>
                <span>
                  <strong>{e.eventType}</strong>
                  <span className="muted"> — {e.note}</span>
                </span>
                <span className="muted" style={{ fontSize: "0.75rem", flexShrink: 0 }}>
                  {new Date(e.createdAt).toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </>
  );
}
