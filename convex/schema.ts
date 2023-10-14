import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        id: v.id("documents"),
        title: v.string(),
        userId: v.string(),
        isAcrchieved: v.boolean(), // for soft deleting
        parentDoc: v.optional(v.id('docements')),
        content: v.optional(v.string()),
        icon: v.optional(v.string()),
        cover_image: v.optional(v.string()),
        isPublished: v.boolean(),
    })
        .index('by_user', ['userId'])
        .index('by_user_parent', ['userId', 'parentDoc'])
});
