'use client'
import Banner from '@/components/Banner'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import React, { useEffect } from 'react'
import dynamic from "next/dynamic";
import Toolbar from '@/app/(main)/(routes)/docs/[docId]/_components/Toolbar'
import Cover from '@/app/(main)/(routes)/docs/[docId]/_components/Cover'
import { redirect, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/clerk-react'
import useStoreUserEffect from '@/hooks/use-store-user'
import BannedView from './_components/BannedView'
import { Loader2 } from 'lucide-react'
import ReportModal from '@/components/modals/ReportModal'

const Editor = dynamic(() => import('@/app/(main)/(routes)/docs/[docId]/_components/Editor'), { ssr: false });


const DocPage = ({ params }: { params: { docId: Id<'documents'> } }) => {

    const doc = useQuery(api.documents.getNote, { id: params.docId })
    // if (doc === undefined) {
    //     return (
    //         <div className='w-full h-full flex items-center justify-center'>
    //             <Loader2 className='w-12 h-12 animate-spin' />
    //         </div>
    //     )
    // }
    const pathname = usePathname()
    const isPreview = pathname.includes('preview')

    useStoreUserEffect()
    const updateVisiters = useMutation(api.documents.newVisiterUpdate)
    const update = useMutation(api.documents.updateDoc)

    const { user, isLoaded } = useUser()

    // if (doc === undefined) {
    //     return (
    //         <div className='w-full h-full flex items-center justify-center'>
    //             <Loader2 className='w-12 h-12 animate-spin' />
    //         </div>
    //     )
    // }

    // if (user === undefined) return null

    if (user === null) return redirect('/')



    const isBanned = doc?.banList?.includes(user?.id!)

    console.log(doc)
    console.log(isBanned)

    useEffect(() => {
        if (isLoaded) {
            updateVisiters({
                docId: params.docId,
                id: user.id
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
        <>
            <ReportModal />
            {isBanned && user?.id ? <BannedView userId={user.id} doc={doc!} /> : <div className={cn(`pt-20 overflow-y-auto h-full`, isPreview && 'pt-0')}>
                {doc?.isAcrchieved && <Banner text='this note has been archived' docId={params.docId} />}

                <Cover preview doc={doc!} />
                {isPreview && (
                    <div className='py-12' />
                )}
                <div className={cn(`max-w-3xl md:max-w-4xl mx-auto h-full`, isPreview && 'max-w-4xl md:max-w-6xl')}>
                    <Toolbar preview initialDoc={doc!} />
                    <Editor editable={false} onChange={onUpdateContent} initialContent={doc?.content} />
                </div>
            </div>}
        </>
    )
}

export default DocPage