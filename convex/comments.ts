import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .collect();

    return Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        const avatarUrl = user?.image ? await ctx.storage.getUrl(user.image as any) : null;
        return {
          ...comment,
          id: comment._id,
          created_at: new Date(comment._creationTime).toISOString(),
          profiles: user ? {
            ...user,
            id: user._id,
            avatar_url: avatarUrl,
          } : null,
        };
      })
    );
  },
});

export const create = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    return await ctx.db.insert("comments", {
      postId: args.postId,
      userId,
      content: args.content,
    });
  },
});
