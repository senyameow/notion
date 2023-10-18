'use client'
import Banner from '@/components/Banner'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import React from 'react'

const DocPage = ({ params }: { params: { docId: Id<'documents'> } }) => {

    const doc = useQuery(api.documents.getNote, { id: params.docId })

    return (
        <div className='pt-20'>
            {doc?.isAcrchieved && <Banner text='this note has been archived' docId={params.docId} />}
            {params.docId}
        </div>
    )
}

export default DocPage