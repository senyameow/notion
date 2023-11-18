'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc as DocType, Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Doc from './Doc';
import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';
import { UserRoles } from './UserRole';
import { useMediaQuery } from 'usehooks-ts';

interface DocListProps {
    data?: DocType<'documents'>[];
    parentId?: Id<'documents'>;
    level?: number;
    userId: string;
}

const DocList = ({ data, parentId, level = 0, userId }: DocListProps) => {

    const isMobile = useMediaQuery('(max-width: 768px)')

    const params = useParams()
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

    const docs = useQuery(api.documents.getDocs, { parentDoc: parentId })
    // console.log(parentId)
    // console.log(docs)

    // в конвексе, для лоадинга используется undefined стейт
    // т.е. если мы грузим доки, то они undefined, иначе они null(если какая=то ошибка, или не найдены)

    // для лоадинга мы приготовили динамический скелетон в doc

    if (docs === undefined) {
        return (
            <div className='w-full flex flex-col gap-2 items-center'>
                <Doc.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Doc.Skeleton level={level} />
                        <Doc.Skeleton level={level} />
                    </>
                )}
            </div>
        )
    }
    // console.log(UserRoles[doc.people?.find(_ => _.id === userId)?.role!])

    return (
        <>
            <p className={cn(`hidden text-sm font-medium text-neutral-500 `, level === 0 && 'hidden', isExpanded && 'last:block', isMobile && 'py-3 text-md')} style={{ paddingLeft: level ? `${(level * 12) + 25}px` : undefined }}>
                No pages inside
            </p>
            {docs.map(doc => (
                <div key={doc._id}>
                    <Doc isMobile={isMobile} access={UserRoles[doc.people?.find(_ => _.id === userId)?.role!]} title={doc.title} level={level} active={params.documentId === doc._id} id={doc._id} onExpand={() => onExpand(doc._id)} icon={doc.icon} isExpanded={isExpanded[doc._id]} />
                    {isExpanded[doc._id] && (
                        <DocList userId={userId} parentId={doc._id} level={level + 1} />
                    )}
                </div>
            ))}
        </>
    )
}

export default DocList
