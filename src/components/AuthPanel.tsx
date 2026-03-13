type AuthPanelProps = {
  busy: boolean;
  error: string | null;
  onCreatePasskey: () => Promise<void>;
  onSignIn: () => Promise<void>;
};

export function AuthPanel({ busy, error, onCreatePasskey, onSignIn }: AuthPanelProps) {
  return (
    <main className="shell">
      <section className="panel">
        <h1>Off Auth</h1>
        <p>Issue merchant-locked cards and stop charges when you unsubscribe.</p>
        <div className="stack">
          <button
            disabled={busy}
            onClick={() => {
              void onCreatePasskey();
            }}
            type="button"
          >
            Create anonymous passkey account
          </button>
          <button
            disabled={busy}
            className="ghost"
            onClick={() => {
              void onSignIn();
            }}
            type="button"
          >
            Sign in with passkey
          </button>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </section>
    </main>
  );
}
