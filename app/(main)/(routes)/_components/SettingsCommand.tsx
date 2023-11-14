'use client'
import React, { useEffect, useState } from 'react'


import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { searchSlice } from '@/store/reducers/SearchSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useUser } from '@clerk/clerk-react'
import { redirect, useRouter } from 'next/navigation'
import { Bell, File, GanttChartSquare, Loader2 } from 'lucide-react'
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

    const { onClose, onToggle } = settingsSlice.actions
    const { isOpen, userId } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()

    console.log(userId)

    const user = useQuery(api.documents.getCurrentUser)

    const notifications = useQuery(api.documents.getCurrentUserNotifications)
    const size = useQuery(api.documents.getCurrentUserSize)

    const updateNotifications = useMutation(api.documents.toggleNotifications).withOptimisticUpdate(
        (localStorage, args) => {
            const currentValue = localStorage.getQuery(api.documents.getCurrentUserNotifications)
            if (currentValue !== undefined || currentValue !== null) {
                localStorage.setQuery(api.documents.getCurrentUserNotifications, {}, args)
            }
        }
    )

    const toggleSize = useMutation(api.documents.toggleSize).withOptimisticUpdate(
        (localStorage) => {
            const currentValue = localStorage.getQuery(api.documents.getCurrentUserSize)
            if (currentValue !== undefined) {
                localStorage.setQuery(api.documents.getCurrentUserSize, {}, !currentValue)
            }
        }
    )

    if (user === undefined || notifications === undefined || size === undefined) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Loader2 className='w-4 h-4 animate-spin' />
            </div>
        )
    }
    if (user === null) return redirect('/')

    const onSwitchNotifications = (value: ToggleNot) => {
        updateNotifications(value)
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

                <div className='flex flex-col items-start gap-2'>
                    <div className='flex flex-row items-center w-full justify-between '>
                        <div className='flex flex-col gap-2'>
                            <h2 className='font-semibold'>Appearance</h2>
                            <p className='text-neutral-500'>Customize how Notion looks on your device</p>
                        </div>
                        <ModeToggle />

                    </div>
                    <div className=" flex items-center space-x-4 rounded-md border p-4 w-full">
                        <GanttChartSquare />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Doc size
                            </p>
                            <p className="text-sm text-muted-foreground">
                                if checked doc will take whole free space
                            </p>
                        </div>
                        <Switch checked={size!} onCheckedChange={() => { toggleSize() }} />
                    </div>
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
                    <Switch onCheckedChange={() => onSwitchNotifications({ reports: !(notifications?.reports), comments: (!!user.notifications?.comments!) })} checked={notifications?.reports} />
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
                    <Switch onCheckedChange={() => onSwitchNotifications({ reports: (notifications?.reports!), comments: !(notifications?.comments) })} checked={notifications?.comments} />
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default SettingsCommand