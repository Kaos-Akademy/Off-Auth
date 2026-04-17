export function LandingBento() {
  return (
    <section className="landing-bento-section" id="landing-bento">
      <div className="landing-bento-head">
        <h2 className="landing-bento-h2">Granular Security Controls.</h2>
        <p className="landing-bento-intro">
          Traditional banking is static. VaultGuard is fluid, programmable, and entirely under your command.
        </p>
      </div>
      <div className="landing-bento-grid">
        <div className="landing-bento-cell landing-bento-span2 landing-bento-low">
          <div className="landing-bento-visual">
            <div className="landing-bento-visual-center">
              <span className="icon landing-i-8xl" style={{ color: "color-mix(in srgb, var(--primary-container) 20%, transparent)" }}>
                credit_card
              </span>
            </div>
          </div>
          <h3 className="landing-bento-h3">Unlimited Virtual Cards</h3>
          <p className="landing-bento-p">
            Create unique cards for every merchant. Separate your Amazon spend from your gym membership and your coffee
            runs.
          </p>
        </div>
        <div className="landing-bento-cell landing-bento-mid">
          <div className="landing-bento-iconbox">
            <span className="icon landing-i-xl" style={{ color: "var(--on-primary)" }}>
              lock_reset
            </span>
          </div>
          <h3 className="landing-bento-h3">Merchant Locks</h3>
          <p className="landing-bento-p landing-bento-p-sm">
            Cards automatically lock to the first merchant they&apos;re used at, making stolen card data useless
            elsewhere.
          </p>
        </div>
        <div className="landing-bento-cell landing-bento-mid">
          <div className="landing-bento-iconbox landing-bento-iconbox-muted">
            <span className="icon landing-i-xl" style={{ color: "var(--primary-fixed)" }}>
              key
            </span>
          </div>
          <h3 className="landing-bento-h3">Wallet Security</h3>
          <p className="landing-bento-p landing-bento-p-sm">
            Approve every high-value transaction via your secure crypto wallet signature for absolute authority.
          </p>
        </div>
        <div className="landing-bento-cell landing-bento-span2kill">
          <div className="landing-kill-watermark" aria-hidden>
            <span className="icon icon-fill landing-i-huge">delete_forever</span>
          </div>
          <div className="landing-kill-inner">
            <div>
              <h3 className="landing-bento-h3">Kill Cards Instantly</h3>
              <p className="landing-bento-p">
                Identify a suspicious charge? Stop it in real-time. Deleting a card instantly revokes all future
                authorizations with one tap.
              </p>
            </div>
            <div className="landing-kill-alert">
              <span className="icon landing-i-3xl" style={{ color: "var(--error)" }}>
                cancel
              </span>
              <div>
                <strong>Suspicious Activity Blocked</strong>
                <small>Card ending in 4532 has been terminated.</small>
              </div>
            </div>
          </div>
        </div>
        <div className="landing-bento-cell landing-bento-span2 landing-bento-zero">
          <h3 className="landing-bento-h3">
            Zero-Liability,
            <br />
            Infinite Protection.
          </h3>
          <p className="landing-bento-p">
            We don&apos;t just secure your money; we secure your peace of mind with 256-bit AES encryption on every
            transaction.
          </p>
          <div className="landing-zero-avatars" aria-hidden>
            <div>
              <span className="icon">shield</span>
            </div>
            <div>
              <span className="icon">verified_user</span>
            </div>
            <div>
              <span className="icon">security</span>
            </div>
          </div>
        </div>
      </div>
      <div id="landing-pricing" style={{ height: 1, marginTop: 48 }} aria-hidden />
    </section>
  );
}
