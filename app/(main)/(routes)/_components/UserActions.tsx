'use client'
import { PlusCircle, Search, Settings } from 'lucide-react'
import React from 'react'
import Action from './Action'
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';


const UserActions = () => {

    const createNote = useMutation(api.documents.create)

    const onCreate = () => {
        const promise = createNote({
            title: 'Untitled'
        })
        toast.promise(promise, {
            loading: 'Creating a new note..',
            success: 'New note Created',
            error: 'Something went wrong'
        })
    }

    return (
        <div className='w-full flex flex-col items-start '>
            <Action label='Search' onClick={() => { }} icon={Search} />
            <Action label='Settings' onClick={() => { }} icon={Settings} />
            <Action label='New page' onClick={onCreate} icon={PlusCircle} />
        </div>
    )
}

export default UserActions