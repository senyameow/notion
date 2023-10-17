'use client'
import React, { useEffect, useState } from 'react'

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { getAllDocs } from '@/convex/documents'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { modalSlice } from '@/store/reducers/ModalSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'

const SearchCommand = () => {

    const docs = useQuery(api.documents.getAllDocs)

    const { onToggle, onClose, onOpen } = modalSlice.actions
    const { isOpen } = useAppSelector(state => state.modal)
    const dispatch = useAppDispatch()

    const { user } = useUser()

    const router = useRouter()

    // const [isMounted, setIsMounted] = useState(false)

    // useEffect(() => {
    //     setIsMounted(true)
    // }, [])

    // if (!isMounted) return null

    const onSelect = (id: string) => {
        router.push(`docs/${id}`)
        dispatch(onClose())
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                dispatch(onToggle());
            }
        }

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [onToggle]);


    return (
        <CommandDialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
            <CommandInput placeholder={`search ${user?.fullName}'s Notion..`} />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Documents">
                    {docs?.map(doc => (
                        <CommandItem key={doc._id} value={`${doc._id}-${doc.title}`} title={doc.title} onSelect={onSelect} className=''>
                            {doc.title}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}

export default SearchCommand