export function LandingProcess() {
  return (
    <section className="landing-process-section" id="landing-how">
      <div className="landing-process-inner">
        <div className="landing-process-head">
          <h2 className="landing-process-h2">The Path to Invisible Security</h2>
          <p className="landing-process-sub">Setup in under 3 minutes. Spend for a lifetime.</p>
        </div>
        <div className="landing-process-grid">
          <div className="landing-process-line" aria-hidden />
          <div className="landing-step">
            <div className="landing-step-circle">
              <strong>01</strong>
            </div>
            <h4>Connect Wallet</h4>
            <p>Link your MetaMask, Coinbase, or Trust Wallet securely.</p>
          </div>
          <div className="landing-step">
            <div className="landing-step-circle">
              <strong>02</strong>
            </div>
            <h4>Link Bank</h4>
            <p>Fund your secure obsidian ledger via Plaid or wire transfer.</p>
          </div>
          <div className="landing-step">
            <div className="landing-step-circle">
              <strong>03</strong>
            </div>
            <h4>Generate Card</h4>
            <p>Create a virtual card for Netflix, Amazon, or a one-time trial.</p>
          </div>
          <div className="landing-step">
            <div className="landing-step-circle landing-step-circle-glow">
              <span className="icon landing-i-3xl">shopping_cart</span>
            </div>
            <h4>Spend Securely</h4>
            <p>Use your card details anywhere. We handle the protection.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
