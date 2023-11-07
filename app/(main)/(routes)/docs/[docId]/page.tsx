'use client'
import Banner from '@/components/Banner'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import React, { useEffect, useState } from 'react'
import Toolbar from './_components/Toolbar'
import { useUser } from '@clerk/clerk-react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { imageSlice } from '@/store/reducers/ImageUploadSlice'
import Cover from './_components/Cover'
import dynamic from "next/dynamic";
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const Editor = dynamic(() => import('./_components/Editor'), { ssr: false });


const DocPage = ({ params }: { params: { docId: Id<'documents'> } }) => {

    const doc = useQuery(api.documents.getNote, { id: params.docId })

    const update = useMutation(api.documents.updateDoc)
    const size = useQuery(api.documents.getCurrentUserSize)

    if (doc === undefined || size === undefined) {
        return (
            <div className=''>
                <Loader2 className='w-12 h-12 animate-spin' />
            </div>
        )
    }

    if (doc === null) return redirect('/docs')

    const { user, isLoaded } = useUser()

    const userRole = doc.people?.find(human => human.id === user?.id)?.role

    console.log(doc.banList?.includes(user?.id!))

    if (doc.banList?.includes(user?.id!)) {
        toast.error(`you've been banned on this doc`)
        return redirect('/docs')
    }

    if (isLoaded && (userRole !== 'ADMIN' && userRole !== 'MOD')) return redirect('/docs')

    const onUpdateContent = (content: string) => {
        update({
            id: params.docId,
            content
        })
    }

    return (
        <div className='pt-20 overflow-y-auto h-full'>
            {doc?.isAcrchieved && <Banner text='this note has been archived' docId={params.docId} />}
            <Cover doc={doc!} />
            <div className={cn(` mx-auto h-full`, size ? 'max-w-full px-2' : 'max-w-3xl md:max-w-4xl')}>
                <Toolbar initialDoc={doc!} />
                <Editor docId={doc._id} onChange={onUpdateContent} initialContent={doc.content} />
            </div>
        </div>
    )
}

export default DocPage