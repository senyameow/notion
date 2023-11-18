'use client'
import { PlusCircle, Search, Settings } from 'lucide-react'
import React, { useEffect } from 'react'
import Action from './Action'
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { searchSlice } from '@/store/reducers/SearchSlice';
import { settingsSlice } from '@/store/reducers/SettingsSlice';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';

interface UserActionsProps {
    userId: string;
    onCollapse: () => void;
    onResetWidth: () => void
}


const UserActions = ({ userId, onCollapse, onResetWidth }: UserActionsProps) => {

    const createNote = useMutation(api.documents.create)
    let isMobile = useMediaQuery('(max-width: 768px)')

    onCollapse = !isMobile ? () => { } : onCollapse

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
            if (isMobile) {
                onCollapse()
            }

        })

    }

    const { onOpen: onOpenSearch } = searchSlice.actions
    const { onOpen: onOpenSettings } = settingsSlice.actions

    const { onToggle: onToggleSearch } = searchSlice.actions
    const { onToggle: onToggleSettings } = settingsSlice.actions
    const dispatch = useAppDispatch()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                dispatch(onToggleSearch());
            }
            if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                dispatch(onToggleSettings());
            }
            if (e.key === "m" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onCreate()
            }
        }

        window.document.addEventListener("keydown", down);
        return () => {
            window.document.removeEventListener("keydown", down);
        }
    }, []);


    return (
        <div className='w-full flex flex-col items-start'>
            <Action isSearch label='Search' onClick={() => dispatch(onOpenSearch())} icon={Search} />
            <Action label='Settings' onClick={() => dispatch(onOpenSettings(userId))} icon={Settings} isSettings />
            <Action label='New page' onClick={onCreate} icon={PlusCircle} isNew />
        </div>
    )
}

export default UserActions