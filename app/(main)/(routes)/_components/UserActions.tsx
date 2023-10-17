'use client'
import { PlusCircle, Search, Settings } from 'lucide-react'
import React from 'react'
import Action from './Action'
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { searchSlice } from '@/store/reducers/SearchSlice';


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

    const { isOpen } = useAppSelector(state => state.search)
    const { onOpen } = searchSlice.actions
    const dispatch = useAppDispatch()


    return (
        <div className='w-full flex flex-col items-start '>
            <Action isSearch label='Search' onClick={() => dispatch(onOpen())} icon={Search} />
            <Action label='Settings' onClick={() => { }} icon={Settings} />
            <Action label='New page' onClick={onCreate} icon={PlusCircle} />
        </div>
    )
}

export default UserActions