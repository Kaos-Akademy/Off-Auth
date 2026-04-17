import type { ReactNode } from "react";

export type AppTab = "dashboard" | "virtual-cards" | "activity" | "wallet";

type AppShellProps = {
  tab: AppTab;
  onTab: (t: AppTab) => void;
  ownerShort: string;
  onLogout: () => void;
  children: ReactNode;
};

const NAV: { id: AppTab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "virtual-cards", label: "Virtual Cards", icon: "credit_card" },
  { id: "activity", label: "Activity", icon: "receipt_long" },
  { id: "wallet", label: "Wallet", icon: "account_balance_wallet" },
];

export function AppShell({ tab, onTab, ownerShort, onLogout, children }: AppShellProps) {
  return (
    <div className="app">
      <aside className="rail" aria-label="Main">
        <div className="rail-brand">
          <span className="icon" aria-hidden>
            shield
          </span>
          VaultGuard
        </div>
        <nav className="rail-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? "active" : ""}
              onClick={() => onTab(item.id)}
            >
              <span className="icon" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="stage">
        <header className="topbar">
          <div>
            <h1>VaultGuard</h1>
            <p className="topbar-meta" title={ownerShort}>
              {ownerShort}
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onLogout}>
            <span className="icon" aria-hidden>
              logout
            </span>
            Log out
          </button>
        </header>
        <div className="page">{children}</div>
      </div>

      <nav className="tabbar" aria-label="Sections">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "active" : ""}
            onClick={() => onTab(item.id)}
          >
            <span className="icon" aria-hidden>
              {item.icon}
            </span>
            {item.label.split(" ")[0]}
          </button>
        ))}
      </nav>
    </div>
  );
}
