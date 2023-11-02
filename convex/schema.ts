import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        userId: v.string(),
        isAcrchieved: v.boolean(), // for soft deleting
        parentDoc: v.optional(v.id('documents')),
        content: v.optional(v.string()),
        icon: v.optional(v.string()),
        cover_image: v.optional(v.string()),
        isPublished: v.boolean(),
        people: v.optional(v.array(v.object({
            id: v.string(),
            role: v.union(
                v.literal('ADMIN'),
                v.literal('EDITOR'),
                v.literal('MOD'),
                v.literal('VISITER'),
            )
        }))),
        banList: v.optional(v.array(v.string())),
        reportList: v.optional(v.array(v.id('reports'))),
        modList: v.optional(v.array(v.string())),
        commentList: v.optional(v.array(v.id('comments')))
    })
        .index('by_user', ['userId'])
        .index('by_user_parent', ['userId', 'parentDoc']),

    users: defineTable({
        userId: v.string(),
        tokenIdentifier: v.string(),
        name: v.string(),
        image_url: v.string(),
        email: v.string(),
        documents: v.optional(v.array(v.id('documents'))),
    }).index('by_token', ['tokenIdentifier']).index('by_userId', ['userId']),

    reports: defineTable({
        userId: v.string(),
        title: v.string(),
        content: v.string(),
        isRead: v.optional(v.boolean()),
        image_url: v.optional(v.string()),
        docId: v.id('documents'),
        isDeleted: v.optional(v.boolean())
    }).index('by_document', ['docId']).index('by_document_user', ['docId', 'userId']),

    comments: defineTable({
        userId: v.string(),
        content: v.string(),
        commentLine: v.optional(v.string()),
        isResolved: v.optional(v.boolean()),
        docId: v.id('documents'),
        replies: v.optional(v.array(v.object({
            content: v.string(),
            userId: v.string(),
            icons: v.optional(v.array(v.string())),
            created_at: v.number()
        })))
    }).index('by_document', ['docId'])

})
// допустим, нам понадобилось найти все доки для определенного юзера (для нас)
// как мы это обычно сделаем без индексов?
// просто найдем все документы, вернем collect() и скорее всего, просто на фронте фильтром отрисуем
// какие минусы: (ну минус 1 - перформанс)
// фильтр = O(n) - пробег, => чем больше доков у нас пришло с бэка, тем медленнее будет это работать
// представьте придет 10^5 доков => O(10^5)
//
// рассмотрим второй вариант, когда мы не вываливаем на стол клиенту все книги из библиотеки и говорим ищи (filter), а, когда библиотекарь сам ищет
// допустим у нас нет индексов, мы ищем по всему массиву книг, что произойдет?
// библиотекарь пойдет слева направо, смотреть по каждой полочке, в каждой книге искать userId, который нам нужен
// т.е. мы делаем фильтром вот так:
// .query('doc')
// .filter((q) => q.eq(q.field('userId'), 'senyameowDance')).collect()
// идет по всем книгам и смотрит (ДОЛГО ПРИ БОЛЬШОМ ОБЪЕМЕ КНИГ), но по идее быстрее чем вываливать книги клиенту (т.к. библиотекарь обученный)
//
// и тут приходят индексы
// для каждой доки, теперь есть карточка, которая хранит:
// 1. userId
// 2. место этой доки в библиотеке
//
// теперь, если от нас хотят получить для определенного юзера, библиотекарь пойдет не по всей библиотеке искать, а в каталог этих карточек
// в карточках найдет того юзера, которого попросили
// возьмет все эти карточки в руки и побежит в библиотеку, уже зная место этих доков => принесет все нужное
//
// такой подход, будет увеличивать перформанс пропорционально росту библиотеки (не очень уверен какой именно k, но разница будет более чем ощутимая при больших объемах данных)