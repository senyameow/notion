import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

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

export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')
        const trashDocs = await ctx.db.query('documents').withIndex('by_user', q =>
            q.eq('userId', identity.subject)
        ).filter(q => q.eq(q.field('isAcrchieved'), true)).order('desc').collect()

        return trashDocs
    }

})

export const restore = mutation({
    args: {
        id: v.id('documents')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')

        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Not found')

        if (doc.userId !== identity.subject) throw new Error('Unauthorized')

        // const restoredDoc = await ctx.db.patch(args.id, { isAcrchieved: false }) // но мы хотим сделать так, что если родитель удален, то чайлда восстановить не получится, надо будет восстановить родителя сначала

        const reccursiveRestore = async (id: Id<'documents'>) => {
            const children = await ctx.db.query('documents').withIndex('by_user_parent', q =>
                q
                    .eq('userId', identity.subject)
                    .eq('parentDoc', id)
            ).collect()

            for (let child of children) {
                await ctx.db.patch(child._id, { isAcrchieved: false })
                await reccursiveRestore(child._id)
            }
        }

        const options: Partial<Doc<'documents'>> = {
            isAcrchieved: false
        }

        if (doc.parentDoc) {
            const parent = await ctx.db.get(doc.parentDoc)
            if (parent?.isAcrchieved) {
                // parent.isAcrchieved = undefined // мы не можем сказать, что isArchieved = undefined, т.к. isAcrhieved is required is schema
                options.parentDoc = undefined; // ... 
            }
        }
        const newDoc = await ctx.db.patch(args.id, options)
        // await ctx.db.patch(args.id, { isAcrchieved: false })

        reccursiveRestore(args.id)

        return newDoc
    }
})

export const removeDoc = mutation({
    args: {
        id: v.id('documents')
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')

        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Not found')
        if (doc.userId !== identity.subject) throw new Error('Unauthorized')

        const deletedDoc = await ctx.db.delete(args.id)
        return deletedDoc
    }
})

export const getAllDocs = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')

        const docs = await ctx.db.query('documents').withIndex('by_user')
            .filter(q =>
                q.eq(q.field('userId'), identity.subject)
            ).order('desc')
            .collect()

        return docs
    }
})

export const updateDoc = mutation({
    args: {
        id: v.id('documents'),
        title: v.optional(v.string()),
        icon: v.optional(v.string()),
        content: v.optional(v.string()),
        cover_image: v.optional(v.string()),
        isPublished: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')

        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Not found')
        if (doc.userId !== identity.subject) throw new Error('Unauthorized')

        const { id, ...rest } = args

        const newDoc = await ctx.db.patch(args.id, {
            ...rest
        })

        return newDoc
    }
}) // сразу создаем мутацию, с помозью которой можно менять сразу все
// делаем это с помощью того, что указываем поля как опциональные.
// т.е. если мы их не передаем, они undefined => в патч приходит undefined => поле не меняется
// теперь у нас есть мутация, которая позволит в рилтайме изменять наши доки (все, что нам угодно)
