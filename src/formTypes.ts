export type CardFormState = {
  merchant: string;
  monthlyAmount: string;
  months: string;
  buffer: string;
  cardKind: "subscription" | "one_time" | "trial";
};
