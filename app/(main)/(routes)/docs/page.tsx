'use client'
import React from 'react'
import Empty from './_components/Empty'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { redirect } from 'next/navigation'

const EmptyPage = () => {

    const docs = useQuery(api.documents.getAllDocs)


    if (docs === undefined || docs.length === 0) {
        return (
            <div className='h-full w-full flex items-center justify-center overflow-x-hidden'>
                <Empty />
            </div>
        )
    }

    else return redirect(`docs/${docs.filter(doc => !doc.isAcrchieved)[docs.filter(doc => !doc.isAcrchieved).length - 1]._id}`)

}

export default EmptyPage