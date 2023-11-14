'use client'
import { PlusCircle, Search, Settings } from 'lucide-react'
import React from 'react'
import Action from './Action'
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { searchSlice } from '@/store/reducers/SearchSlice';
import { settingsSlice } from '@/store/reducers/SettingsSlice';
import { useRouter } from 'next/navigation';

interface UserActionsProps {
    userId: string;
}


const UserActions = ({ userId }: UserActionsProps) => {

    const createNote = useMutation(api.documents.create)

    const router = useRouter()

    const onCreate = () => {
        const promise = createNote({
            title: 'Untitled'
        })
        toast.promise(promise, {
            loading: 'Creating a new note..',
            success: 'New note Created',
            error: 'Something went wrong'
        })
        promise.then(doc => {
            router.push(`/docs/${doc}`)
        })
    }

    const { onOpen: onOpenSearch } = searchSlice.actions
    const { onOpen: onOpenSettings } = settingsSlice.actions
    const dispatch = useAppDispatch()


    return (
        <div className='w-full flex flex-col items-start '>
            <Action isSearch label='Search' onClick={() => dispatch(onOpenSearch())} icon={Search} />
            <Action label='Settings' onClick={() => dispatch(onOpenSettings(userId))} icon={Settings} isSettings />
            <Action label='New page' onClick={onCreate} icon={PlusCircle} isNew />
        </div>
    )
}

export default UserActions