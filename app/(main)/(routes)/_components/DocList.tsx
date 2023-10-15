'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface DocListProps {
    data: Doc<'documents'>[];
    id: Id<'documents'>;
    level?: number;
}

const DocList = ({ data, id, level }: DocListProps) => {

    const pathname = usePathname()
    const router = useRouter()
    const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({})
    // id: true/false,
    // id1: true/false

    const onExpand = (id: string) => {
        setIsExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        })) // довольно полезная конструкция
    } // т.е. мы хотим развернуть только 1 штуку, но как?
    // пусть она хранятся в объекте, id: bool
    // мы хотим нажать на какую-то одну и ее раскрыть, как?
    // принимаем от клика получаем айди этого дока, 
    // и проходимся по стейту наших доков, где хранится инфа о том, раскрыты они или нет
    // сначала всех спрэдим, а потом для того дока, чье айди получили разворачиваем стейт (т.к. можно еще и закрыть доку)
    // если сказать id: !prev[id], то будет неправильно, т.к. id - значение получим для этого айди, а [id] = ключ

    // тут будем юзать нашу квери, правда пока хз откуда мы получаем parentDoc

    const docs = useQuery(api.documents.getDocs, { parentDoc: id })

    // в конвексе, для лоадинга используется undefined стейт
    // т.е. если мы грузим доки, то они undefined, иначе они null(если какая=то ошибка, или не найдены)

    if (docs === undefined) {
        return (
            <div>
            </div>
        )
    }

    return (
        <div>

        </div>
    )
}

export default DocList
