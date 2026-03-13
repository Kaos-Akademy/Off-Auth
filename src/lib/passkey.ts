import {
  startAuthentication,
  startRegistration,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const STORE_KEY = "offauth-passkey-owner";

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function toBase64Url(input: Uint8Array): string {
  const chars = Array.from(input, (x) => String.fromCharCode(x)).join("");
  return btoa(chars).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function registerPasskey(): Promise<string> {
  const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
  if (convexUrl) {
    const client = new ConvexHttpClient(convexUrl);
    const begin = await client.action(api.passkeys.beginRegistration, {});
    const registrationResponse = await startRegistration({
      optionsJSON: begin.optionsJSON as PublicKeyCredentialCreationOptionsJSON,
    });
    await client.action(api.passkeys.finishRegistration, {
      ownerKey: begin.ownerKey,
      stateId: begin.stateId,
      responseJSON: registrationResponse,
    });
    localStorage.setItem(STORE_KEY, begin.ownerKey);
    return begin.ownerKey;
  }

  const ownerKey = createOwnerKey();
  if (!window.PublicKeyCredential) {
    localStorage.setItem(STORE_KEY, ownerKey);
    return ownerKey;
  }

  const challenge = randomBytes(32);
  const userId = randomBytes(16);
  await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: "Off Auth" },
      user: {
        id: userId,
        name: ownerKey,
        displayName: ownerKey,
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
      timeout: 60_000,
      attestation: "none",
    },
  });

  localStorage.setItem(STORE_KEY, ownerKey);
  return ownerKey;
}

export async function loginWithPasskey(): Promise<string | null> {
  const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
  if (convexUrl) {
    const client = new ConvexHttpClient(convexUrl);
    const begin = await client.action(api.passkeys.beginAuthentication, {});
    const authResponse = await startAuthentication({
      optionsJSON: begin.optionsJSON as PublicKeyCredentialRequestOptionsJSON,
    });
    const done = await client.action(api.passkeys.finishAuthentication, {
      stateId: begin.stateId,
      responseJSON: authResponse,
    });
    localStorage.setItem(STORE_KEY, done.ownerKey);
    return done.ownerKey;
  }

  if (!window.PublicKeyCredential) {
    return localStorage.getItem(STORE_KEY);
  }

  const storedOwner = localStorage.getItem(STORE_KEY);
  if (!storedOwner) {
    return null;
  }

  const challenge = randomBytes(32);
  await navigator.credentials.get({
    publicKey: {
      challenge,
      timeout: 60_000,
      userVerification: "preferred",
    },
  });
  return storedOwner;
}

export function logoutPasskey(): void {
  localStorage.removeItem(STORE_KEY);
}

export function getStoredOwnerKey(): string | null {
  return localStorage.getItem(STORE_KEY);
}

export function createOwnerKey(): string {
  const suffix = toBase64Url(randomBytes(8));
  return `anon-${suffix}`;
}
