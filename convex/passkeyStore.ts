import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

function now() {
  return Date.now();
}

export const saveChallengeInternal = internalMutation({
  args: {
    stateId: v.string(),
    ownerKey: v.union(v.string(), v.null()),
    challenge: v.string(),
    purpose: v.union(v.literal("register"), v.literal("authenticate")),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("passkeyChallenges", {
      stateId: args.stateId,
      ownerKey: args.ownerKey,
      challenge: args.challenge,
      purpose: args.purpose,
      expiresAt: args.expiresAt,
      usedAt: null,
      createdAt: now(),
    });
  },
});

export const getChallengeByStateInternal = internalQuery({
  args: { stateId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("passkeyChallenges")
      .withIndex("by_state_id", (q) => q.eq("stateId", args.stateId))
      .first();
  },
});

export const consumeChallengeInternal = internalMutation({
  args: { stateId: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("passkeyChallenges")
      .withIndex("by_state_id", (q) => q.eq("stateId", args.stateId))
      .first();
    if (!row) return;
    await ctx.db.patch(row._id, { usedAt: now() });
  },
});

export const listByOwnerInternal = internalQuery({
  args: { ownerKey: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("passkeys")
      .withIndex("by_owner", (q) => q.eq("ownerKey", args.ownerKey))
      .collect();
  },
});

export const getByCredentialIdInternal = internalQuery({
  args: { credentialId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("passkeys")
      .withIndex("by_credential_id", (q) => q.eq("credentialId", args.credentialId))
      .first();
  },
});

export const upsertPasskeyInternal = internalMutation({
  args: {
    ownerKey: v.string(),
    credentialId: v.string(),
    publicKey: v.string(),
    counter: v.number(),
    transports: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("passkeys")
      .withIndex("by_credential_id", (q) => q.eq("credentialId", args.credentialId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        ownerKey: args.ownerKey,
        publicKey: args.publicKey,
        counter: args.counter,
        transports: args.transports,
        lastUsedAt: now(),
      });
      return;
    }
    await ctx.db.insert("passkeys", {
      ownerKey: args.ownerKey,
      credentialId: args.credentialId,
      publicKey: args.publicKey,
      counter: args.counter,
      transports: args.transports,
      createdAt: now(),
      lastUsedAt: now(),
    });
  },
});

export const updateCounterInternal = internalMutation({
  args: { credentialId: v.string(), counter: v.number() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("passkeys")
      .withIndex("by_credential_id", (q) => q.eq("credentialId", args.credentialId))
      .first();
    if (!existing) return;
    await ctx.db.patch(existing._id, {
      counter: args.counter,
      lastUsedAt: now(),
    });
  },
});
