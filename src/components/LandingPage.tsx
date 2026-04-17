import { LandingNav } from "./landing/LandingNav";
import { LandingHero } from "./landing/LandingHero";
import { LandingBento } from "./landing/LandingBento";
import { LandingProcess } from "./landing/LandingProcess";
import { LandingTrustFooter } from "./landing/LandingTrustFooter";

type LandingPageProps = {
  onOpenAuth: () => void;
};

export function LandingPage({ onOpenAuth }: LandingPageProps) {
  return (
    <div className="landing-root">
      <LandingNav onOpenAuth={onOpenAuth} />
      <main className="landing-main">
        <LandingHero onOpenAuth={onOpenAuth} />
        <LandingBento />
        <LandingProcess />
        <LandingTrustFooter onOpenAuth={onOpenAuth} />
      </main>
    </div>
  );
}
