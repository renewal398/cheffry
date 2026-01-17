import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { userCountry: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .take(100);

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        const avatarUrl = author?.image ? await ctx.storage.getUrl(author.image as any) : null;

        const interactions = await ctx.db
          .query("interactions")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect();

        const likesCount = interactions.filter((i) => i.type === "like").length;
        const dislikesCount = interactions.filter((i) => i.type === "dislike").length;

        const commentsCount = (await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect()).length;

        let userInteraction = null;
        if (userId) {
          const interaction = await ctx.db
            .query("interactions")
            .withIndex("by_userId_postId", (q) => q.eq("userId", userId).eq("postId", post._id))
            .unique();
          userInteraction = interaction?.type;
        }

        const mediaUrls = await Promise.all(
          (post.mediaStorageIds || []).map(async (storageId) => {
             return await ctx.storage.getUrl(storageId as any);
          })
        );

        return {
          ...post,
          id: post._id,
          created_at: new Date(post._creationTime).toISOString(),
          profiles: author ? {
            ...author,
            id: author._id,
            avatar_url: avatarUrl,
          } : null,
          likes_count: likesCount,
          dislikes_count: dislikesCount,
          comments_count: commentsCount,
          user_interaction: userInteraction,
          media_urls: mediaUrls.filter(url => url !== null) as string[],
        };
      })
    );

    // Prioritization logic
    let interactedCountries: string[] = [];
    if (userId) {
       const countryInteractions = await ctx.db
        .query("userCountryInteractions")
        .withIndex("by_userId_country", (q) => q.eq("userId", userId))
        .collect();
       interactedCountries = countryInteractions
        .sort((a, b) => b.interactionCount - a.interactionCount)
        .map((c) => c.country);
    }

    return enrichedPosts.sort((a, b) => {
      if (a.country === args.userCountry && b.country !== args.userCountry) return -1;
      if (b.country === args.userCountry && a.country !== args.userCountry) return 1;

      const aIndex = interactedCountries.indexOf(a.country);
      const bIndex = interactedCountries.indexOf(b.country);

      if (aIndex !== -1 && bIndex === -1) return -1;
      if (bIndex !== -1 && aIndex === -1) return 1;
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

      return b._creationTime - a._creationTime;
    });
  },
});

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const viewerId = await getAuthUserId(ctx);
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.userId);
        const avatarUrl = author?.image ? await ctx.storage.getUrl(author.image as any) : null;

        const interactions = await ctx.db
          .query("interactions")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect();

        const likesCount = interactions.filter((i) => i.type === "like").length;
        const dislikesCount = interactions.filter((i) => i.type === "dislike").length;

        const commentsCount = (await ctx.db
          .query("comments")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect()).length;

        let userInteraction = null;
        if (viewerId) {
          const interaction = await ctx.db
            .query("interactions")
            .withIndex("by_userId_postId", (q) => q.eq("userId", viewerId).eq("postId", post._id))
            .unique();
          userInteraction = interaction?.type;
        }

        const mediaUrls = await Promise.all(
          (post.mediaStorageIds || []).map(async (storageId) => {
             return await ctx.storage.getUrl(storageId as any);
          })
        );

        return {
          ...post,
          id: post._id,
          created_at: new Date(post._creationTime).toISOString(),
          profiles: author ? {
            ...author,
            id: author._id,
            avatar_url: avatarUrl,
          } : null,
          likes_count: likesCount,
          dislikes_count: dislikesCount,
          comments_count: commentsCount,
          user_interaction: userInteraction,
          media_urls: mediaUrls.filter(url => url !== null) as string[],
        };
      })
    );
  },
});

export const create = mutation({
  args: {
    content: v.string(),
    mediaStorageIds: v.array(v.string()),
    country: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    return await ctx.db.insert("posts", {
      userId,
      content: args.content,
      mediaStorageIds: args.mediaStorageIds,
      country: args.country,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const post = await ctx.db.get(args.id);
    if (!post || post.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, { content: args.content });
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const post = await ctx.db.get(args.id);
    if (!post || post.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});
