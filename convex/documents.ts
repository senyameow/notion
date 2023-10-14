import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const create = mutation({
    args: {
        title: v.string(),
        parentDoc: v.optional(v.id('documents'))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')
        const newDoc = await ctx.db.insert('documents', { title: args.title, userId: identity.subject, isAcrchieved: false, isPublished: false, parentDoc: args.parentDoc })

        return newDoc;
    }
})

export const getNote = query({
    args: {
        id: v.id('documents')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')
        const docs = ctx.db.get(args.id)

        return docs
    }
}) // get single doc

export const getDocs = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')
        const docs = ctx.db.query('documents').collect()

        return docs
    }
}) // get single doc
