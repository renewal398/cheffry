import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const toggleInteraction = mutation({
  args: {
    postId: v.id("posts"),
    type: v.union(v.literal("like"), v.literal("dislike")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("interactions")
      .withIndex("by_userId_postId", (q) => q.eq("userId", userId).eq("postId", args.postId))
      .unique();

    if (existing) {
      if (existing.type === args.type) {
        // Remove interaction if same type
        await ctx.db.delete(existing._id);
      } else {
        // Update interaction if different type
        await ctx.db.patch(existing._id, { type: args.type });
      }
    } else {
      // Create new interaction
      await ctx.db.insert("interactions", {
        userId,
        postId: args.postId,
        type: args.type,
      });
    }

    // Update country interaction count
    const post = await ctx.db.get(args.postId);
    if (post) {
      const countryInteraction = await ctx.db
        .query("userCountryInteractions")
        .withIndex("by_userId_country", (q) => q.eq("userId", userId).eq("country", post.country))
        .unique();

      if (countryInteraction) {
        await ctx.db.patch(countryInteraction._id, {
          interactionCount: countryInteraction.interactionCount + 1,
        });
      } else {
        await ctx.db.insert("userCountryInteractions", {
          userId,
          country: post.country,
          interactionCount: 1,
        });
      }
    }
  },
});
