import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function timestamp() {
  return Date.now();
}

export const listByOwner = query({
  args: { ownerKey: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("cards")
      .withIndex("by_owner", (q) => q.eq("ownerKey", args.ownerKey))
      .collect();
  },
});

export const listEventsByOwner = query({
  args: { ownerKey: v.string() },
  handler: async (ctx, args) => {
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_owner", (q) => q.eq("ownerKey", args.ownerKey))
      .collect();
    const events = await Promise.all(
      cards.map((card) =>
        ctx.db
          .query("cardEvents")
          .withIndex("by_card", (q) => q.eq("cardId", card._id))
          .collect()
      )
    );
    return events.flat();
  },
});

export const create = mutation({
  args: {
    ownerKey: v.string(),
    merchant: v.string(),
    monthlyLimitCents: v.number(),
    cycleCount: v.number(),
    bufferCents: v.number(),
  },
  handler: async (ctx, args) => {
    const fundedCents = args.monthlyLimitCents * args.cycleCount + args.bufferCents;
    const id = await ctx.db.insert("cards", {
      ownerKey: args.ownerKey,
      merchant: args.merchant,
      monthlyLimitCents: args.monthlyLimitCents,
      cycleCount: args.cycleCount,
      cyclesRemaining: args.cycleCount,
      fundedCents,
      spentCents: 0,
      refundableCents: fundedCents,
      status: "active",
      createdAt: timestamp(),
      updatedAt: timestamp(),
    });

    await ctx.db.insert("cardEvents", {
      cardId: id,
      eventType: "created",
      note: `Card created for ${args.merchant}`,
      createdAt: timestamp(),
    });
  },
});

export const unsubscribe = mutation({
  args: { cardId: v.id("cards"), ownerKey: v.string() },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    if (!card || card.ownerKey !== args.ownerKey) {
      throw new Error("Card not found");
    }
    const refundableCents = Math.max(card.fundedCents - card.spentCents, 0);
    await ctx.db.patch(args.cardId, {
      status: "unsubscribed",
      cyclesRemaining: 0,
      refundableCents,
      updatedAt: timestamp(),
    });
    await ctx.db.insert("cardEvents", {
      cardId: args.cardId,
      eventType: "unsubscribed",
      note: "Card frozen and future charges blocked",
      createdAt: timestamp(),
    });
    await ctx.db.insert("cardEvents", {
      cardId: args.cardId,
      eventType: "refundRequested",
      note: "Refund queued for remaining balance",
      createdAt: timestamp(),
    });
    await ctx.db.insert("refundJobs", {
      cardId: args.cardId,
      ownerKey: card.ownerKey,
      amountCents: refundableCents,
      status: "pending",
      destination: "original-funding-source",
      createdAt: timestamp(),
      updatedAt: timestamp(),
    });
  },
});

export const listRefundsByOwner = query({
  args: { ownerKey: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("refundJobs")
      .withIndex("by_owner", (q) => q.eq("ownerKey", args.ownerKey))
      .collect();
  },
});
