'use client'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

const UserInfo = () => {


    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>

                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default UserInfo