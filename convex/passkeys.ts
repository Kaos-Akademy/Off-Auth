"use node";

import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";

const CHALLENGE_TTL_MS = 5 * 60 * 1000;

function now() {
  return Date.now();
}

function base64UrlFromBytes(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function bytesFromBase64Url(input: string): Uint8Array {
  return new Uint8Array(Buffer.from(input, "base64url"));
}

function env() {
  const rpID = process.env.PASSKEY_EXPECTED_RP_ID ?? "localhost";
  const rpName = process.env.PASSKEY_RP_NAME ?? "Off Auth";
  const expectedOrigin = process.env.PASSKEY_EXPECTED_ORIGIN ?? "http://localhost:5173";
  return { rpID, rpName, expectedOrigin };
}

export const beginRegistration = action({
  args: {},
  handler: async (ctx): Promise<{
    ownerKey: string;
    stateId: string;
    optionsJSON: Awaited<ReturnType<typeof generateRegistrationOptions>>;
  }> => {
    const { rpID, rpName } = env();
    const ownerKey = `anon-${crypto.randomUUID()}`;
    const existing: Array<{ credentialId: string; transports: string[] }> = await ctx.runQuery(
      internal.passkeyStore.listByOwnerInternal,
      { ownerKey }
    );
    const options = await generateRegistrationOptions({
      rpID,
      rpName,
      userName: ownerKey,
      userDisplayName: "Anonymous User",
      timeout: 60_000,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
      excludeCredentials: existing.map((passkey: { credentialId: string }) => ({
        id: passkey.credentialId,
      })),
    });

    const stateId = crypto.randomUUID();
    await ctx.runMutation(internal.passkeyStore.saveChallengeInternal, {
      stateId,
      ownerKey,
      challenge: options.challenge,
      purpose: "register",
      expiresAt: now() + CHALLENGE_TTL_MS,
    });

    return { ownerKey, stateId, optionsJSON: options };
  },
});

export const finishRegistration = action({
  args: {
    ownerKey: v.string(),
    stateId: v.string(),
    responseJSON: v.any(),
  },
  handler: async (ctx, args): Promise<{ ownerKey: string }> => {
    const { rpID, expectedOrigin } = env();
    const challenge: any = await ctx.runQuery(internal.passkeyStore.getChallengeByStateInternal, {
      stateId: args.stateId,
    });
    if (!challenge || challenge.purpose !== "register" || challenge.ownerKey !== args.ownerKey) {
      throw new Error("Invalid registration state");
    }
    if (challenge.usedAt || challenge.expiresAt < now()) {
      throw new Error("Registration challenge expired");
    }

    const verification = await verifyRegistrationResponse({
      response: args.responseJSON,
      expectedChallenge: challenge.challenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      throw new Error("Passkey registration failed");
    }

    await ctx.runMutation(internal.passkeyStore.consumeChallengeInternal, {
      stateId: args.stateId,
    });

    await ctx.runMutation(internal.passkeyStore.upsertPasskeyInternal, {
      ownerKey: args.ownerKey,
      credentialId: verification.registrationInfo.credential.id,
      publicKey: base64UrlFromBytes(verification.registrationInfo.credential.publicKey),
      counter: verification.registrationInfo.credential.counter,
      transports: verification.registrationInfo.credential.transports ?? [],
    });

    return { ownerKey: args.ownerKey };
  },
});

export const beginAuthentication = action({
  args: {},
  handler: async (ctx): Promise<{
    stateId: string;
    optionsJSON: Awaited<ReturnType<typeof generateAuthenticationOptions>>;
  }> => {
    const { rpID } = env();
    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 60_000,
      userVerification: "preferred",
    });
    const stateId = crypto.randomUUID();
    await ctx.runMutation(internal.passkeyStore.saveChallengeInternal, {
      stateId,
      ownerKey: null,
      challenge: options.challenge,
      purpose: "authenticate",
      expiresAt: now() + CHALLENGE_TTL_MS,
    });
    return { stateId, optionsJSON: options };
  },
});

export const finishAuthentication = action({
  args: {
    stateId: v.string(),
    responseJSON: v.any(),
  },
  handler: async (ctx, args): Promise<{ ownerKey: string }> => {
    const { rpID, expectedOrigin } = env();
    const challenge: any = await ctx.runQuery(internal.passkeyStore.getChallengeByStateInternal, {
      stateId: args.stateId,
    });
    if (!challenge || challenge.purpose !== "authenticate") {
      throw new Error("Invalid authentication state");
    }
    if (challenge.usedAt || challenge.expiresAt < now()) {
      throw new Error("Authentication challenge expired");
    }

    const response = args.responseJSON;
    const credential: any = await ctx.runQuery(internal.passkeyStore.getByCredentialIdInternal, {
      credentialId: response.id,
    });
    if (!credential) {
      throw new Error("Unknown passkey");
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge.challenge,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: false,
      credential: {
        id: credential.credentialId,
        publicKey: bytesFromBase64Url(credential.publicKey),
        counter: credential.counter,
        transports: credential.transports,
      },
    });

    if (!verification.verified) {
      throw new Error("Passkey authentication failed");
    }

    await ctx.runMutation(internal.passkeyStore.consumeChallengeInternal, {
      stateId: args.stateId,
    });
    await ctx.runMutation(internal.passkeyStore.updateCounterInternal, {
      credentialId: credential.credentialId,
      counter: verification.authenticationInfo.newCounter,
    });

    return { ownerKey: credential.ownerKey };
  },
});

