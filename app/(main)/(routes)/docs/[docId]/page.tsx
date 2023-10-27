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

const Editor = dynamic(() => import('./_components/Editor'), { ssr: false });


const DocPage = ({ params }: { params: { docId: Id<'documents'> } }) => {

    const doc = useQuery(api.documents.getNote, { id: params.docId })

    const update = useMutation(api.documents.updateDoc)

    const { user, isLoaded } = useUser()

    if (user === null) return redirect('/')

    useEffect(() => {
        if (isLoaded) {
            console.log(user.id)
            update({
                id: params.docId,
                newVisiter: user.id
            })
        }
    }, [isLoaded])

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
            <div className='max-w-3xl md:max-w-4xl mx-auto h-full'>
                <Toolbar initialDoc={doc!} />
                <Editor onChange={onUpdateContent} initialContent={doc?.content} />
            </div>
        </div>
    )
}

export default DocPage