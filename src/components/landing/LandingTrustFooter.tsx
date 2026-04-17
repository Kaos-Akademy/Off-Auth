type LandingTrustFooterProps = {
  onOpenAuth: () => void;
};

export function LandingTrustFooter({ onOpenAuth }: LandingTrustFooterProps) {
  return (
    <>
      <section className="landing-trust-section" id="landing-trust">
        <div className="landing-trust-shell">
          <div className="landing-trust-grid">
            <div>
              <h2 className="landing-trust-h2">Trusted by over 50,000 digital nomads and security experts.</h2>
              <div className="landing-trust-stats">
                <div>
                  <p className="landing-trust-stat-val">$420M+</p>
                  <p className="landing-trust-stat-label">Transactions Protected</p>
                </div>
                <div>
                  <p className="landing-trust-stat-val">99.9%</p>
                  <p className="landing-trust-stat-label">Uptime SLA</p>
                </div>
              </div>
            </div>
            <div className="landing-trust-quotes">
              <blockquote className="landing-glass-quote">
                <p>
                  &ldquo;The merchant-locking feature is a game changer. I never worry about a vendor being breached
                  anymore.&rdquo;
                </p>
                <div className="landing-glass-quote-footer">
                  <div className="landing-glass-avatar" />
                  <span>Alex Chen, DeFi Architect</span>
                </div>
              </blockquote>
              <blockquote className="landing-glass-quote">
                <p>
                  &ldquo;Instantly killing cards after a one-time purchase is the ultimate way to manage SaaS
                  subscriptions.&rdquo;
                </p>
                <div className="landing-glass-quote-footer">
                  <div className="landing-glass-avatar" />
                  <span>Sarah Miller, Lead Developer</span>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-final-cta">
        <h2 className="landing-final-h2">Secure your wealth today.</h2>
        <p className="landing-final-lead">
          Join the thousands who have taken back control of their digital footprint.
        </p>
        <button type="button" className="landing-btn-primary-xl" onClick={onOpenAuth}>
          Get Started with VaultGuard
        </button>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div>
            <div className="landing-footer-brand">VaultGuard</div>
            <p className="landing-footer-copy">© 2024 VaultGuard. Securely backed by The Obsidian Ledger.</p>
          </div>
          <div className="landing-footer-links">
            <a href="#landing-hero">Privacy Policy</a>
            <a href="#landing-hero">Terms of Service</a>
            <a href="#landing-bento">Security Audit</a>
            <a href="#landing-hero">Status</a>
          </div>
          <div className="landing-footer-social">
            <button type="button" aria-label="Share">
              <span className="icon" style={{ fontSize: "1rem" }}>
                share
              </span>
            </button>
            <button type="button" aria-label="Security">
              <span className="icon" style={{ fontSize: "1rem" }}>
                lock
              </span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
