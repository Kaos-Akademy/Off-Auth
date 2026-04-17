type LandingNavProps = {
  onOpenAuth: () => void;
};

export function LandingNav({ onOpenAuth }: LandingNavProps) {
  return (
    <header className="landing-topnav">
      <nav className="landing-topnav-inner" aria-label="Primary">
        <a className="landing-brand-text" href="#landing-hero">
          VaultGuard
        </a>
        <div className="landing-topnav-links">
          <a className="landing-nav-link landing-nav-link-active" href="#landing-hero">
            Product
          </a>
          <a className="landing-nav-link" href="#landing-bento">
            Resources
          </a>
          <a className="landing-nav-link" href="#landing-pricing">
            Pricing
          </a>
          <a className="landing-nav-link" href="#landing-bento">
            Company
          </a>
        </div>
        <button type="button" className="landing-btn-getstarted" onClick={onOpenAuth}>
          Get Started
        </button>
      </nav>
    </header>
  );
}
