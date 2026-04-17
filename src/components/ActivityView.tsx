import { formatMoney } from "../lib/money";
import type { SubscriptionCard } from "../types";

type ActivityViewProps = {
  cards: SubscriptionCard[];
  busy: boolean;
  onUnsubscribe: (cardId: string) => void;
};

export function ActivityView({ cards, busy, onUnsubscribe }: ActivityViewProps) {
  const active = cards.filter((c) => c.status === "active");
  const monthlyRun = active.reduce((s, c) => s + c.monthlyLimitCents, 0);
  const blocked = cards.filter((c) => c.status === "frozen").length;
  const savedPool = cards.reduce((s, c) => s + c.refundableCents, 0);

  return (
    <>
      <div className="grid-2">
        <section className="card">
          <p className="muted">Monthly trajectory</p>
          <p className="stat-lg">{formatMoney(monthlyRun)}</p>
          <p className="muted">Committed per month (active cards)</p>
        </section>
        <section className="card">
          <p className="muted">Protected pool</p>
          <p className="stat-lg">{formatMoney(savedPool)}</p>
          <p className="muted">Refundable if you unsubscribe today</p>
        </section>
      </div>

      <section className="card">
        <p className="pill warn">
          <span className="icon" aria-hidden>
            security
          </span>
          {blocked} frozen card{blocked === 1 ? "" : "s"}
        </p>
        <h2 style={{ marginTop: 12 }}>Subscriptions & activity</h2>
        <p className="muted">All merchant-locked virtual cards and their standing.</p>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Cycles</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    No subscriptions yet.
                  </td>
                </tr>
              ) : (
                cards.map((c) => (
                  <tr key={c.id}>
                    <td>{c.merchant}</td>
                    <td>{formatMoney(c.monthlyLimitCents)} / mo</td>
                    <td>{c.cyclesRemaining}</td>
                    <td>
                      <span className={`status-dot ${c.status}`}>{c.status}</span>
                    </td>
                    <td>
                      {c.status === "active" ? (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ padding: "6px 10px", fontSize: "0.75rem" }}
                          disabled={busy}
                          onClick={() => void onUnsubscribe(c.id)}
                        >
                          Unsubscribe
                        </button>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
