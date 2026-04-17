"use client";

import type { FlowConfig } from "@onflow/react-core";
import { FlowProvider } from "@onflow/react-sdk";
import { useMemo, type ReactNode } from "react";

function flowNetworkConfig(network: string): FlowConfig {
  const n = network === "mainnet" ? "mainnet" : "testnet";
  if (n === "mainnet") {
    return {
      flowNetwork: "mainnet",
      accessNodeUrl: "https://rest-mainnet.onflow.org",
      discoveryWallet: "https://fcl-discovery.onflow.org/authn",
      discoveryAuthnEndpoint: "https://fcl-discovery.onflow.org/api/authn",
    };
  }
  return {
    flowNetwork: "testnet",
    accessNodeUrl: "https://rest-testnet.onflow.org",
    discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
    discoveryAuthnEndpoint: "https://fcl-discovery.onflow.org/api/testnet/authn",
  };
}

export function FlowWebProvider({ children }: { children: ReactNode }) {
  const config = useMemo((): FlowConfig => {
    const flowNetwork =
      process.env.NEXT_PUBLIC_FLOW_NETWORK === "mainnet" ? "mainnet" : "testnet";
    const base = flowNetworkConfig(flowNetwork);
    const walletconnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
    const appDetailUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim() ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return {
      ...base,
      appDetailTitle: "VaultGuard",
      appDetailDescription: "Passkey-secured vault with Flow wallet support.",
      appDetailUrl: appDetailUrl || undefined,
      appDetailIcon: process.env.NEXT_PUBLIC_APP_ICON_URL?.trim() || undefined,
      walletconnectProjectId: walletconnectProjectId || undefined,
    };
  }, []);

  return <FlowProvider config={config}>{children}</FlowProvider>;
}
