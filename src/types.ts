export type CardStatus = "active" | "frozen" | "unsubscribed";

export type SubscriptionCard = {
  id: string;
  ownerKey: string;
  merchant: string;
  monthlyLimitCents: number;
  cycleCount: number;
  cyclesRemaining: number;
  fundedCents: number;
  spentCents: number;
  refundableCents: number;
  status: CardStatus;
  createdAt: number;
  updatedAt: number;
};

export type CardEventType =
  | "created"
  | "authorizationApproved"
  | "authorizationDenied"
  | "frozen"
  | "unsubscribed"
  | "refundRequested"
  | "refundCompleted";

export type CardEvent = {
  id: string;
  cardId: string;
  eventType: CardEventType;
  note: string;
  createdAt: number;
};
