type WalletSecurityViewProps = {
  ownerKey: string;
};

function shortKey(key: string): string {
  if (key.length <= 14) return key;
  return `${key.slice(0, 8)}…${key.slice(-4)}`;
}

export function WalletSecurityView({ ownerKey }: WalletSecurityViewProps) {
  return (
    <>
      <section className="card">
        <p className="pill">
          <span className="icon" aria-hidden>
            account_balance_wallet
          </span>
          Active connection
        </p>
        <h2>Passkey vault</h2>
        <p className="muted">Primary identity for issuing and revoking virtual cards.</p>
        <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: "var(--surface-raised)" }}>
          <p className="muted" style={{ margin: "0 0 6px", fontSize: "0.7rem", textTransform: "uppercase" }}>
            Owner key
          </p>
          <code style={{ fontSize: "0.8rem", wordBreak: "break-all" }}>{shortKey(ownerKey)}</code>
        </div>
      </section>

      <section className="card">
        <h2>App security</h2>
        <p className="muted">Multi-layer protection for your vault (passkeys are always required).</p>
        <div className="toggle-row">
          <span>
            <span className="icon" aria-hidden>
              fingerprint
            </span>{" "}
            Passkey login
          </span>
          <div className="switch" aria-hidden />
        </div>
        <div className="toggle-row">
          <span>
            <span className="icon" aria-hidden>
              lock
            </span>{" "}
            Merchant-locked cards
          </span>
          <div className="switch" aria-hidden />
        </div>
        <div className="toggle-row">
          <span>
            <span className="icon" aria-hidden>
              schedule
            </span>{" "}
            Session safety
          </span>
          <div className="switch" aria-hidden />
        </div>
        <p className="muted" style={{ marginTop: 14, fontSize: "0.8rem" }}>
          <span className="icon" aria-hidden>
            info
          </span>{" "}
          Security changes propagate with your next sign-in.
        </p>
      </section>

      <section className="card">
        <h2>History export</h2>
        <p className="muted">Generate reports of card lifecycle events.</p>
        <div className="stack" style={{ marginTop: 12 }}>
          <button type="button" className="btn btn-ghost" disabled>
            <span className="icon" aria-hidden>
              description
            </span>
            Export as CSV (soon)
          </button>
          <button type="button" className="btn btn-ghost" disabled>
            <span className="icon" aria-hidden>
              picture_as_pdf
            </span>
            Export as PDF (soon)
          </button>
        </div>
      </section>
    </>
  );
}
