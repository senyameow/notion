'use client'
import Banner from '@/components/Banner'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import React from 'react'
import Toolbar from './_components/Toolbar'
import { useUser } from '@clerk/clerk-react'

const DocPage = ({ params }: { params: { docId: Id<'documents'> } }) => {

    const doc = useQuery(api.documents.getNote, { id: params.docId })

    const { user } = useUser()

    return (
        <div className='pt-20'>
            {doc?.isAcrchieved && <Banner text='this note has been archived' docId={params.docId} />}
            <div className='max-w-3xl md:max-w-4xl mx-auto pt-40'>
                <Toolbar initialDoc={doc!} />
            </div>
        </div>
    )
}

export default DocPage