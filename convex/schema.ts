import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  passkeys: defineTable({
    ownerKey: v.string(),
    credentialId: v.string(),
    publicKey: v.string(),
    counter: v.number(),
    transports: v.array(v.string()),
    createdAt: v.number(),
    lastUsedAt: v.number(),
  })
    .index("by_owner", ["ownerKey"])
    .index("by_credential_id", ["credentialId"]),
  passkeyChallenges: defineTable({
    stateId: v.string(),
    ownerKey: v.union(v.string(), v.null()),
    challenge: v.string(),
    purpose: v.union(v.literal("register"), v.literal("authenticate")),
    expiresAt: v.number(),
    usedAt: v.union(v.number(), v.null()),
    createdAt: v.number(),
  }).index("by_state_id", ["stateId"]),
  cards: defineTable({
    ownerKey: v.string(),
    merchant: v.string(),
    monthlyLimitCents: v.number(),
    cycleCount: v.number(),
    cyclesRemaining: v.number(),
    fundedCents: v.number(),
    spentCents: v.number(),
    refundableCents: v.number(),
    status: v.union(v.literal("active"), v.literal("frozen"), v.literal("unsubscribed")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerKey"]),
  cardEvents: defineTable({
    cardId: v.id("cards"),
    eventType: v.string(),
    note: v.string(),
    createdAt: v.number(),
  }).index("by_card", ["cardId"]),
  refundJobs: defineTable({
    cardId: v.id("cards"),
    ownerKey: v.string(),
    amountCents: v.number(),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("paid"), v.literal("failed")),
    destination: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerKey"])
    .index("by_card", ["cardId"]),
});
