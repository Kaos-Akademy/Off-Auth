"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useFlowCurrentUser } from "@onflow/react-sdk";
import { backend } from "./lib/backend";
import {
  getStoredOwnerKey,
  loginWithPasskey,
  logoutPasskey,
  registerPasskey,
} from "./lib/passkey";
import type { AppTab } from "./components/AppShell";
import { AppShell } from "./components/AppShell";
import { LandingPage } from "./components/LandingPage";
import { LoginScreen } from "./components/LoginScreen";
import { DashboardView } from "./components/DashboardView";
import { VirtualCardsView } from "./components/VirtualCardsView";
import { ActivityView } from "./components/ActivityView";
import { WalletSecurityView } from "./components/WalletSecurityView";
import type { CardFormState } from "./formTypes";
import type { CardEvent, SubscriptionCard } from "./types";

const EMPTY_FORM: CardFormState = {
  merchant: "",
  monthlyAmount: "15.99",
  months: "3",
  buffer: "0",
  cardKind: "subscription",
};

function ownerLabel(key: string): string {
  if (key.length <= 18) return key;
  return `${key.slice(0, 10)}…${key.slice(-6)}`;
}

export default function App() {
  const { user: flowUser, unauthenticate } = useFlowCurrentUser();
  /** Avoid reading localStorage in useState initializer — Next SSR runs this on the server. */
  const [ownerKey, setOwnerKey] = useState<string | null>(null);
  const [cards, setCards] = useState<SubscriptionCard[]>([]);
  const [events, setEvents] = useState<CardEvent[]>([]);
  const [form, setForm] = useState<CardFormState>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<AppTab>("dashboard");
  /** When not signed in: show marketing landing until user chooses Log in / Get started. */
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setOwnerKey(getStoredOwnerKey());
  }, []);

  /** If there is no passkey in storage but FCL restores a Flow session, use the wallet address as owner identity. */
  useEffect(() => {
    if (getStoredOwnerKey()) return;
    const addr = flowUser?.loggedIn && flowUser.addr ? String(flowUser.addr).trim() : "";
    if (!addr) return;
    setOwnerKey((prev) => (prev === addr ? prev : addr));
  }, [flowUser?.loggedIn, flowUser?.addr]);

  async function reload(key: string) {
    const [nextCards, nextEvents] = await Promise.all([
      backend.listCards(key),
      backend.listEvents(key),
    ]);
    setCards(nextCards.sort((a, b) => b.createdAt - a.createdAt));
    setEvents(nextEvents.sort((a, b) => b.createdAt - a.createdAt));
  }

  useEffect(() => {
    if (!ownerKey) return;
    void reload(ownerKey);
  }, [ownerKey]);

  const eventsByCard = useMemo(() => {
    return events.reduce<Record<string, CardEvent[]>>((acc, event) => {
      acc[event.cardId] ??= [];
      acc[event.cardId].push(event);
      return acc;
    }, {});
  }, [events]);

  async function onCreateAnonymousPasskey() {
    setError(null);
    setBusy(true);
    try {
      const key = await registerPasskey();
      setOwnerKey(key);
      await reload(key);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onPasskeyLogin() {
    setError(null);
    setBusy(true);
    try {
      const key = await loginWithPasskey();
      if (!key) throw new Error("No passkey account found. Create one first.");
      setOwnerKey(key);
      await reload(key);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onCreateCard(e: FormEvent) {
    e.preventDefault();
    if (!ownerKey) return;
    setError(null);
    setBusy(true);
    try {
      const monthlyAmount = Math.round(Number(form.monthlyAmount) * 100);
      let cycleCount = Number(form.months);
      if (form.cardKind === "one_time" || form.cardKind === "trial") cycleCount = Math.max(1, cycleCount);
      if (!Number.isFinite(cycleCount) || cycleCount < 1) cycleCount = 1;
      const bufferCents = Math.round(Number(form.buffer) * 100);
      await backend.createCard({
        ownerKey,
        merchant: form.merchant.trim(),
        monthlyLimitCents: monthlyAmount,
        cycleCount,
        bufferCents,
      });
      setForm(EMPTY_FORM);
      await reload(ownerKey);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onUnsubscribe(cardId: string) {
    if (!ownerKey) return;
    setError(null);
    setBusy(true);
    try {
      await backend.unsubscribeCard(cardId, ownerKey);
      await reload(ownerKey);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function onLogout() {
    logoutPasskey();
    unauthenticate();
    setOwnerKey(null);
    setCards([]);
    setEvents([]);
    setTab("dashboard");
    setAuthOpen(false);
  }

  if (!ownerKey) {
    if (!authOpen) {
      return <LandingPage onOpenAuth={() => setAuthOpen(true)} />;
    }
    return (
      <LoginScreen
        busy={busy}
        error={error}
        onCreatePasskey={onCreateAnonymousPasskey}
        onSignIn={onPasskeyLogin}
        onFlowWalletConnected={(flowAddress) => {
          setError(null);
          setOwnerKey(flowAddress);
          setTab("dashboard");
        }}
        onBack={() => {
          setAuthOpen(false);
          setError(null);
        }}
      />
    );
  }

  return (
    <AppShell tab={tab} onTab={setTab} ownerShort={ownerLabel(ownerKey)} onLogout={onLogout}>
      {error ? <p className="error">{error}</p> : null}
      {tab === "dashboard" ? <DashboardView cards={cards} events={events} /> : null}
      {tab === "virtual-cards" ? (
        <VirtualCardsView
          cards={cards}
          eventsByCard={eventsByCard}
          form={form}
          onChange={setForm}
          onSubmit={onCreateCard}
          busy={busy}
          onUnsubscribe={onUnsubscribe}
        />
      ) : null}
      {tab === "activity" ? (
        <ActivityView cards={cards} busy={busy} onUnsubscribe={onUnsubscribe} />
      ) : null}
      {tab === "wallet" ? <WalletSecurityView ownerKey={ownerKey} /> : null}
    </AppShell>
  );
}
