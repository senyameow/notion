'use client'
import React from 'react'
import Empty from './_components/Empty'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const EmptyPage = () => {

    const docs = useQuery(api.documents.getAllDocs)
    const currentUser = useQuery(api.documents.getCurrentUser)


    if (currentUser === undefined || docs === undefined) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Loader2 className='w-12 h-12 animate-spin' />
            </div>
        )
    }

    const usersNotArchievedDoc = docs.filter(doc => !doc.isAcrchieved && doc.userId === currentUser?.userId)

    if (usersNotArchievedDoc.length === 0) {
        return (
            <div className='h-full w-full flex items-center justify-center overflow-x-hidden'>
                <Empty />
            </div>
        )
    }

    return redirect(`docs/${usersNotArchievedDoc[usersNotArchievedDoc.length - 1]._id}`)

}

export default EmptyPage