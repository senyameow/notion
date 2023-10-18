'use client'
import Banner from '@/components/Banner'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import React from 'react'
import Toolbar from './_components/Toolbar'
import { useUser } from '@clerk/clerk-react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { imageSlice } from '@/store/reducers/ImageUploadSlice'

const DocPage = ({ params }: { params: { docId: Id<'documents'> } }) => {

    const doc = useQuery(api.documents.getNote, { id: params.docId })

    const { onOpen } = imageSlice.actions
    const dispatch = useAppDispatch()

    return (
        <div className='pt-20'>
            {doc?.isAcrchieved && <Banner text='this note has been archived' docId={params.docId} />}
            {doc?.cover_image && (
                <div className='w-full h-[200px] relative group'>
                    <Image src={doc.cover_image} alt='cover' className='object-cover' fill />
                    <Button onClick={() => dispatch(onOpen(doc._id))} className='absolute bottom-2 opacity-0 right-2 group-hover:opacity-100 transition'>
                        Change Cover
                    </Button>
                </div>
            )}
            <div className='max-w-3xl md:max-w-4xl mx-auto pt-40'>
                <Toolbar initialDoc={doc!} />
            </div>
        </div>
    )
}

export default DocPage