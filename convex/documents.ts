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

export const archiveDoc = mutation({
    args: {
        docId: v.id('documents')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')
        const archievedDoc = await ctx.db.patch(args.docId, { isAcrchieved: true })

        return archievedDoc
    }
})


export const getDocs = query({
    args: {
        parentDoc: v.optional(v.id('documents'))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')
        const docs = await ctx.db.query('documents').withIndex('by_user_parent', q =>
            q.eq('userId', identity.subject).eq('parentDoc', args.parentDoc)
        ).filter(q => q.eq(q.field('isAcrchieved'), false)).order('asc').collect() // и хотим показать только те, которые не удалены (типо)

        return docs
    }
})
// по факту бесполезный квери, т.к. нам нужны только доки определенного юзера, используем индексы!

