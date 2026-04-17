import { useCallback, useState } from "react";
import { useFlowCurrentUser } from "@onflow/react-sdk";

type LoginScreenProps = {
  busy: boolean;
  error: string | null;
  onCreatePasskey: () => Promise<void>;
  onSignIn: () => Promise<void>;
  /** Called after Flow wallet auth succeeds so the app can enter the shell with this address as owner identity. */
  onFlowWalletConnected?: (flowAddress: string) => void;
  onBack?: () => void;
};

export function LoginScreen({
  busy,
  error,
  onCreatePasskey,
  onSignIn,
  onFlowWalletConnected,
  onBack,
}: LoginScreenProps) {
  const { authenticate } = useFlowCurrentUser();
  const [flowBusy, setFlowBusy] = useState(false);
  const [flowError, setFlowError] = useState<string | null>(null);

  const runFlowAuth = useCallback(async () => {
    setFlowError(null);
    setFlowBusy(true);
    try {
      const user = await authenticate();
      const addr = user?.addr ? String(user.addr).trim() : "";
      if (addr && onFlowWalletConnected) {
        onFlowWalletConnected(addr);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Flow wallet connection failed.";
      setFlowError(msg);
    } finally {
      setFlowBusy(false);
    }
  }, [authenticate, onFlowWalletConnected]);

  const anyBusy = busy || flowBusy;

  return (
    <div className="login-page">
      <div className="login-card">
        {onBack ? (
          <button type="button" className="btn btn-ghost login-back" onClick={onBack}>
            <span className="icon" aria-hidden>
              arrow_back
            </span>
            Back to site
          </button>
        ) : null}
        <p className="pill">
          <span className="icon" aria-hidden>
            account_balance_wallet
          </span>
          Active connection
        </p>
        <h1>VaultGuard</h1>
        <p className="muted">
          Passkey-secured vault. Issue merchant-locked virtual cards and stop charges when you unsubscribe.
        </p>
        <div className="stack">
          <button type="button" className="btn" disabled={anyBusy} onClick={() => void onCreatePasskey()}>
            <span className="icon" aria-hidden>
              key
            </span>
            Create passkey vault
          </button>
          <button type="button" className="btn btn-ghost" disabled={anyBusy} onClick={() => void onSignIn()}>
            <span className="icon" aria-hidden>
              login
            </span>
            Sign in with passkey
          </button>
          <button type="button" className="btn" disabled={anyBusy} onClick={() => void runFlowAuth()}>
            <span className="icon" aria-hidden>
              account_balance_wallet
            </span>
            Connect Wallet
          </button>
        </div>
        {flowError ? <p className="error">{flowError}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </div>
    </div>
  );
}
