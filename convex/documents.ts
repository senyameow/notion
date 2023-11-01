import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'
import { paginationOptsValidator } from 'convex/server'

export const create = mutation({
    args: {
        title: v.string(),
        parentDoc: v.optional(v.id('documents'))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')
        const newDoc = await ctx.db.insert('documents', { title: args.title, userId: identity.subject, isAcrchieved: false, isPublished: false, parentDoc: args.parentDoc, people: [{ id: identity.subject, role: 'ADMIN' }] })
        return newDoc;
    }
})

export const getNote = query({
    args: {
        id: v.id('documents')
    },
    handler: async (ctx, args) => {
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

export const getAllUserDocs = query({
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

export const getAllDocs = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unaithenticated')
        return await ctx.db.query('documents').order('desc').collect()
    }
})


export const updateDoc = mutation({
    args: {
        id: v.id('documents'),
        title: v.optional(v.string()),
        icon: v.optional(v.string()),
        content: v.optional(v.string()),
        cover_image: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
        newVisiter: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity?.subject) throw new Error('Unauthenticated')

        const doc = await ctx.db.get(args.id)
        if (!doc) throw new Error('Not found')
        const user = doc.people?.find(updater => updater.id === identity.subject)
        if (!user) throw new Error('Not found')
        if (user?.role !== 'ADMIN' && user.role !== 'EDITOR' && user.role !== 'MOD') throw new Error('Unauthorized')


        let { id, newVisiter, ...rest } = args



        const newDoc = await ctx.db.patch(args.id, {
            ...rest,

        })

        return newDoc
    }
}) // сразу создаем мутацию, с помозью которой можно менять сразу все
// делаем это с помощью того, что указываем поля как опциональные.
// т.е. если мы их не передаем, они undefined => в патч приходит undefined => поле не меняется
// теперь у нас есть мутация, которая позволит в рилтайме изменять наши доки (все, что нам угодно)
export const docVisiterUpdate = mutation({
    args: {
        id: v.string(),
        docId: v.id('documents')
    },
    handler: async (ctx, args) => {
        if (!args.id) throw new Error('Unauthorized')
        const doc = await ctx.db.get(args.docId)
        if (doc === null) throw new Error('Not found')
        const people = doc.people || []
        if (doc.people?.map(q => q.id).includes(args.id)) return
        await ctx.db.patch(args.docId, {
            people: [...people, { id: args.id, role: 'VISITER' }],

        })
    }
})
export const banUser = mutation({
    args: {
        id: v.string(),
        docId: v.id('documents')
    },
    handler: async (ctx, args) => {
        if (!args.id) throw new Error('Unauthorized')
        const doc = await ctx.db.get(args.docId)
        if (doc === null) throw new Error('Not found')
        const banned = doc.banList || []
        if (doc.banList?.includes(args.id)) {
            return await ctx.db.patch(args.docId, {
                banList: banned.filter(id => id !== args.id)
            })
        }
        return await ctx.db.patch(args.docId, {
            banList: [...banned, args.id]
        })
    }
})
export const getAllPeople = query({
    args: {
        ids: v.optional(v.array(v.string()))
    },
    handler: async (ctx, args) => {
        return (await ctx.db.query('users').collect()).filter(user => args.ids?.includes(user.userId))
    }
})

export const getUser = query({
    args: {
        id: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('users').withIndex('by_userId').filter(q =>
            q.eq(q.field('userId'), args.id)
        ).first()
        if (user === null) throw new Error('Not found')
        return user
    }
})

export const UsersDoc = query({
    args: {
        paginationOpts: paginationOptsValidator,
        userId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        // if (args.userId === undefined) return
        // const user = await ctx.db.query('users').withIndex('by_userId').filter(q => q.eq(q.field('userId'), args.userId)).first()
        // console.log(user)
        return await ctx.db.query('documents').withIndex('by_user').filter(q => q.eq(q.field('userId'), args.userId)).paginate(args.paginationOpts)
    }
})

export const reports = query({
    args: {
        docId: v.id('documents')
    },
    handler: async (ctx, args) => {
        return await ctx.db.query('reports').withIndex('by_document').filter(q =>
            q.eq(q.field('docId'), args.docId)
        ).order('desc').collect()
    }
})

export const createReport = mutation({
    args: {
        docId: v.id('documents'),
        content: v.string(),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject
        return await ctx.db.insert('reports', {
            content: args.content,
            title: args.title,
            isRead: false,
            userId,
            docId: args.docId
        })
    }
})

export const updateReport = mutation({
    args: {
        id: v.id('reports'),
        isRead: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args
        return await ctx.db.patch(args.id, {
            ...rest
        })
    }
})

export const report = query({
    args: {
        docId: v.id('documents'),
        userId: v.string()
    },
    handler: async (ctx, args) => {
        // const identity = await ctx.auth.getUserIdentity()
        // if (identity?.subject === undefined) throw new Error('Unauthorized')
        // const userId = identity.subject
        return await ctx.db.query('reports').withIndex('by_document_user', q => q.eq('docId', args.docId).eq('userId', args.userId)).unique()
    }
})

export const deleteReport = mutation({
    args: {
        id: v.id('reports')
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            isDeleted: true
        })
    }
})

export const updateRole = mutation({
    args: {
        userId: v.string(),
        docId: v.id('documents'),
        role: v.union(
            v.literal('ADMIN'),
            v.literal('EDITOR'),
            v.literal('MOD'),
            v.literal('VISITER'),
        )
    },
    handler: async (ctx, args) => {
        // check updater role
        const doc = await ctx.db.get(args.docId)
        if (doc === null) throw new Error('Not found')

        let user = doc.people?.find(user => user.id === args.userId)
        if (!user) throw new Error('User not found')
        if (user?.role === args.role) return
        const newUser = { ...user, role: args.role }
        const newPeople = doc.people?.map(user => {
            if (user.id === newUser.id) return newUser
            return user
        })
        return await ctx.db.patch(args.docId, {
            people: [...newPeople!]
        })
    }
})

export const createComment = mutation({
    args: {
        docId: v.id('documents'),
        content: v.string(),
        commentLine: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')
        const userId = identity.subject

        const doc = await ctx.db.get(args.docId)
        if (doc === null) throw new Error('Not found')
        const newComment = {
            userId,
            content: args.content,
            commentLine: args.commentLine,
            isReviewed: false,
            docId: args.docId,
            replies: []
        }
        return await ctx.db.insert('comments', newComment)
    }
})

export const createCommentReply = mutation({
    args: {
        commentId: v.id('comments'),
        content: v.string(),
        userId: v.string(),
        icons: v.optional(v.array(v.string()))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthorized')

        const { commentId, ...rest } = args

        const comment = await ctx.db.get(commentId)

        console.log(comment)
        if (comment === null) throw new Error('Not found')
        const replies = comment.replies
        console.log(replies)
        if (replies === undefined) throw new Error('Not found')


        return await ctx.db.patch(args.commentId, {
            replies: [...replies, { ...rest, created_at: Date.now() }]
        })
    }
})

// export const getComment = query({
//     args: {
//         id: v.id('comments')
//     },
//     handler: async (ctx, args) => {
//         return await ctx.db.get(args.id)
//     }
// })
export const getComments = query({
    args: {
        docId: v.id('documents')
    },
    handler: async (ctx, args) => {
        return await ctx.db.query('comments').withIndex('by_document', q => q.eq('docId', args.docId)).order('desc').collect()
    }
})