import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listChats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    return await ctx.db
      .query("chefChats")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getMessages = query({
  args: { chatId: v.id("chefChats") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) throw new Error("Unauthorized");

    return await ctx.db
      .query("chefMessages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

export const createChat = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    return await ctx.db.insert("chefChats", {
      userId,
      title: args.title,
    });
  },
});

export const addMessage = mutation({
  args: {
    chatId: v.id("chefChats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) throw new Error("Unauthorized");

    return await ctx.db.insert("chefMessages", {
      chatId: args.chatId,
      role: args.role,
      content: args.content,
    });
  },
});

// Internal version for AI route that doesn't require user auth token
// In a real app, this should be protected by other means (e.g. internal API key)
export const addMessageFromAI = mutation({
  args: {
    chatId: v.id("chefChats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chefMessages", {
      chatId: args.chatId,
      role: args.role,
      content: args.content,
    });
  },
});

export const deleteChat = mutation({
  args: { chatId: v.id("chefChats") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.chatId);
    const messages = await ctx.db
      .query("chefMessages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }
  },
});
