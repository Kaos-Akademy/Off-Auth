const NETFLIX_MARK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgNK31zhLA7Mq9LGq1dVcqLx-Ta8vyl6mMXKUQPHL9iyj_QVL5Gv-ATl2H3mEA8VrXEjB6TrKuDM3KyY7HbIDdVacDf1pRWdS3agxhADv5BMnEDhiMTcYzRLJq7ZgZQvaCk41rJ8RnlydeCIkD_jT2N0nU9emR3mCNy6JcEoOMB9dCjYdy20BlD3pYwHiMGmFNu8KRPSEKdg5Fx_ZQgErrKIqUzT5xvv3dVw2iMdDhtHJBsGbNbQwaD0NBPFzrG-sctulUmC0Lc3m_";

type LandingHeroProps = {
  onOpenAuth: () => void;
};

export function LandingHero({ onOpenAuth }: LandingHeroProps) {
  return (
    <section className="landing-hero-section" id="landing-hero">
      <div className="landing-hero-grid">
        <div className="landing-hero-copy">
          <div className="landing-badge-row">
            <span className="landing-vault-pulse" aria-hidden />
            <span className="landing-badge-text">Security / Early access</span>
          </div>
          <h1 className="landing-hero-h1">
            Your Real Card.
            <span className="landing-hero-h1-grad">Protected by Code.</span>
          </h1>
          <p className="landing-hero-lead">
            Generate unlimited virtual debit cards backed by your crypto wallet. Stop unwanted subscriptions and take
            total control of your digital spending.
          </p>
          <div className="landing-hero-ctas">
            <button type="button" className="landing-btn-primary-lg" onClick={onOpenAuth}>
              Get Your Vault Card
            </button>
            <a className="landing-btn-outline-lg" href="#landing-bento">
              View Documentation
            </a>
          </div>
        </div>
        <div className="landing-visual-wrap" aria-hidden>
          <div className="landing-visual-glow" />
          <div className="landing-glass-card">
            <div className="landing-card-top">
              <span className="icon landing-i-3xl" style={{ color: "var(--primary-container)" }}>
                contactless
              </span>
              <div className="landing-card-meta">
                <p className="landing-card-kicker">Merchant Lock</p>
                <p className="landing-card-merchant">NETFLIX INC.</p>
              </div>
            </div>
            <p className="landing-card-pan">•••• •••• •••• 9012</p>
            <div className="landing-card-foot">
              <span>VAULTGUARD VIRTUAL</span>
              <img className="landing-card-logo" src={NETFLIX_MARK} alt="" loading="lazy" />
            </div>
          </div>
          <div className="landing-hero-card2">
            <div className="landing-card-top">
              <span className="icon icon-fill landing-i-3xl" style={{ color: "var(--primary-container)" }}>
                shield
              </span>
              <div className="landing-card-meta">
                <p className="landing-card-kicker">Single Use</p>
                <p className="landing-card-merchant">AMAZON</p>
              </div>
            </div>
            <p className="landing-card-pan">•••• •••• •••• 4532</p>
            <div className="landing-card-foot">
              <span>THE OBSIDIAN LEDGER</span>
              <span className="icon" style={{ color: "var(--muted)" }}>
                lock
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
