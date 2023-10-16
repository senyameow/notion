import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Id } from './_generated/dataModel'

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
        const doc = await ctx.db.get(args.docId)
        if (!doc) {
            throw new Error('Not found')
        }
        if (doc.userId !== identity.subject) {
            throw new Error('Unauthorized')
        }

        const arcieveChild = async (id: Id<'documents'>) => {
            const children = await ctx.db.query('documents')
                .withIndex('by_user_parent', q =>
                    q.eq('userId', identity.subject).eq('parentDoc', id)
                )
                .collect()
            for (const child of children) {
                await ctx.db.patch(child._id, { isAcrchieved: true })
                await arcieveChild(child._id)
            }
        }
        arcieveChild(args.docId)

        const newDoc = await ctx.db.patch(args.docId, { isAcrchieved: true }) // если бы мы хотели удалить только 1 документ по его айдишнику, то было бы круто
        // но тут встает вопрос, как нам удалить и всех его чилдренов?
        // 1ый чайлд это дока будет иметь отличный parentId от 2ого и т.д.
        // а у нас может быть хоть миллион вложенных доков
        // следовательно надо писать рекурсию, которая будет фетчить чайлда по айдишнику и удалять его и так далее



        return newDoc
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

