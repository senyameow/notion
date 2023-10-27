'use client'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { userModalSlice } from '@/store/reducers/UserModalSlice'

const UserInfoModal = () => {

    const { isOpen, user } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const { onClose } = userModalSlice.actions

    return (
        <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user?.name}</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default UserInfoModal