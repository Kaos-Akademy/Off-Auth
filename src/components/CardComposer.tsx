import { FormEvent } from "react";

export type CardFormState = {
  merchant: string;
  monthlyAmount: string;
  months: string;
  buffer: string;
};

type CardComposerProps = {
  busy: boolean;
  form: CardFormState;
  onChange: (next: CardFormState) => void;
  onSubmit: (event: FormEvent) => Promise<void>;
};

export function CardComposer({ busy, form, onChange, onSubmit }: CardComposerProps) {
  return (
    <section className="panel">
      <h2>Issue a new card</h2>
      <form
        className="grid"
        onSubmit={(event) => {
          void onSubmit(event);
        }}
      >
        <input
          value={form.merchant}
          onChange={(e) => onChange({ ...form, merchant: e.target.value })}
          placeholder="Merchant (Amazon, Netflix...)"
          required
        />
        <input
          type="number"
          min="1"
          step="0.01"
          value={form.monthlyAmount}
          onChange={(e) => onChange({ ...form, monthlyAmount: e.target.value })}
          placeholder="Monthly amount"
          required
        />
        <input
          type="number"
          min="1"
          value={form.months}
          onChange={(e) => onChange({ ...form, months: e.target.value })}
          placeholder="Months to allow"
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.buffer}
          onChange={(e) => onChange({ ...form, buffer: e.target.value })}
          placeholder="Optional buffer"
        />
        <button disabled={busy} type="submit">
          Issue card
        </button>
      </form>
    </section>
  );
}
