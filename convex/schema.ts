import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Custom fields for Cheffry
    country: v.optional(v.string()),
  }).index("by_email", ["email"]),

  posts: defineTable({
    userId: v.id("users"),
    content: v.string(),
    mediaStorageIds: v.array(v.string()), // Store as strings to be flexible, but intended for storageIds
    country: v.string(),
  }).index("by_userId", ["userId"])
    .index("by_country", ["country"]),

  comments: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    content: v.string(),
  }).index("by_postId", ["postId"]),

  interactions: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    type: v.union(v.literal("like"), v.literal("dislike")),
  }).index("by_userId_postId", ["userId", "postId"])
    .index("by_postId", ["postId"]),

  userCountryInteractions: defineTable({
    userId: v.id("users"),
    country: v.string(),
    interactionCount: v.number(),
  }).index("by_userId_country", ["userId", "country"]),

  chefChats: defineTable({
    userId: v.id("users"),
    title: v.string(),
  }).index("by_userId", ["userId"]),

  chefMessages: defineTable({
    chatId: v.id("chefChats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  }).index("by_chatId", ["chatId"]),
});
