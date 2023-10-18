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
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { searchSlice } from '@/store/reducers/SearchSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import { File } from 'lucide-react'
import { settingsSlice } from '@/store/reducers/SettingsSlice'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/ui/ModToggle'

const SettingsCommand = () => {


    const { onToggle, onClose, onOpen } = settingsSlice.actions
    const { isOpen } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()

    // const [isMounted, setIsMounted] = useState(false)

    // useEffect(() => {
    //     setIsMounted(true)
    // }, [])

    // if (!isMounted) return null

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                dispatch(onToggle());
            }
        }

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [onToggle]);


    return (
        <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>

            <DialogContent className='w-full px-4'>
                <DialogHeader className='pb-3'>
                    <div className='text-lg font-medium'>
                        My settings
                    </div>
                </DialogHeader>
                <Separator />

                <div className='flex flex-row items-center w-full justify-between '>
                    <div className='flex flex-col gap-2'>
                        <h2 className='font-semibold'>Appearance</h2>
                        <p className='text-neutral-500'>Customize how Notion looks on your device</p>
                    </div>
                    <ModeToggle />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SettingsCommand