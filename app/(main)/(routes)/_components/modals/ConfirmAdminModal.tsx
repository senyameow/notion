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
import { Doc } from '@/convex/_generated/dataModel';

interface AdminConfirmRoleProps {
    children: React.ReactNode;
    user: Doc<'users'>;
    doc: Doc<'documents'>;
}

const AdminConfirmRole = ({ children, user, doc }: AdminConfirmRoleProps) => {

    const onConfirm = () => {

    }

    return (
        <AlertDialog  >
            <AlertDialogTrigger className='relative z-[99999] w-full'>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className='z-[99999]'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {user.name} will have access to all info about your note and will be able to delete {doc.title} permanently
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Sure</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default AdminConfirmRole