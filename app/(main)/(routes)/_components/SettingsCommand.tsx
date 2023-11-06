'use client'
import React, { useEffect, useState } from 'react'


import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { searchSlice } from '@/store/reducers/SearchSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useUser } from '@clerk/clerk-react'
import { redirect, useRouter } from 'next/navigation'
import { Bell, File, Loader2 } from 'lucide-react'
import { settingsSlice } from '@/store/reducers/SettingsSlice'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/ui/ModToggle'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface ToggleNot {
    reports: boolean;
    comments: boolean;
}

const SettingsCommand = () => {

    const { onClose, onOpen, onToggle } = settingsSlice.actions
    const { isOpen, userId } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()

    console.log(userId)

    const user = useQuery(api.documents.getCurrentUser)

    const updateNotifications = useMutation(api.documents.toggleNotifications).withOptimisticUpdate(
        (localStorage, args) => {
            const currentUser = localStorage.getQuery(api.documents.getCurrentUser)
            if (currentUser !== undefined) {
                const currentValue = user?.notifications
                if (currentValue !== undefined) {
                    localStorage.setQuery(api.documents.getCurrentUser, {}, currentUser?.notifications)
                }
            }
        }
    )

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

    if (user === undefined) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Loader2 className='w-4 h-4 animate-spin' />
            </div>
        )
    }
    if (user === null) return redirect('/')

    console.log(user)


    const onSwitchNotifications = async (value: ToggleNot) => {
        console.log(value)
        await updateNotifications(
            value
        )
        toast.success('это фишка если чо')
    }

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
                <div className='text-lg font-medium'>
                    Notifications
                </div>
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <Bell />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Report Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You will receive all reports from other people.
                        </p>
                    </div>
                    <Switch onCheckedChange={() => onSwitchNotifications({ reports: !(!!user.notifications?.reports), comments: (!!user.notifications?.comments!) })} checked={!!user.notifications?.reports} />
                </div>
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                    <Bell />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Comment Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                            If new comment comes up you will immediately know.
                        </p>
                    </div>
                    <Switch onCheckedChange={() => onSwitchNotifications({ reports: (!!user.notifications?.reports!), comments: !(!!user.notifications?.comments!) })} checked={!!user.notifications?.comments} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SettingsCommand