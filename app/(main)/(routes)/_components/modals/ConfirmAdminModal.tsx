'use client'
import React, { useState } from 'react'

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
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { adminRoleModalSlice } from '@/store/reducers/ConfirmAdminRoleModalSlice';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { boolean, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';

const AdminConfirmRole = () => {

    const { isOpen, doc, user } = useAppSelector(state => state.admin)
    const dispatch = useAppDispatch()
    const { onClose } = adminRoleModalSlice.actions
    const updateRole = useMutation(api.documents.updateRole)

    const [pass, setPass] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const formSchema = z.object({
        pass: z.string().includes(doc?.title!, { message: ' ' }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pass: '',
        },
    })

    const onConfirm = async () => {
        try {
            setIsLoading(true)
            await updateRole({
                userId: user?.userId!,
                docId: doc?._id!,
                role: 'ADMIN'
            })
            toast.success('0_0')
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            dispatch(onClose())
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={() => dispatch(onClose())} >
            <AlertDialogContent className='z-[99999]'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onConfirm)}>
                        <AlertDialogHeader className='my-2'>
                            <AlertDialogTitle className='mb-2'>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                {user?.name!} will have access to all info about your note and will be able to delete {doc?.title!} permanently
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <FormField
                            control={form.control}
                            name="pass"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Type the title of this doc or your secret code to continue
                                    </FormLabel>
                                    <FormControl className='w-full'>
                                        <Input placeholder='title or pass' {...field} onChange={e => setPass(e.target.value)} value={pass} className='text-xl z-[99999] text-white focus-visible:border-none focus-within:ring-0 focus-within:ring-offset-0 outline-none focus-visible:right-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <AlertDialogFooter className='pt-5'>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type='submit' onClick={onConfirm} disabled={pass !== doc?.title! || form.formState.isLoading}>
                                {form.formState.isLoading || isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Sure'}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default AdminConfirmRole