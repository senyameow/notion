import React from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmModalProps {
    children: React.ReactNode;
    onConfirm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ConfirmModal = ({ children, onConfirm }: ConfirmModalProps) => {
    return (
        <AlertDialog >
            <AlertDialogTrigger className='relative z-[99999]'>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className='z-[99999]'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default ConfirmModal