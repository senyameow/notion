'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '../ui/dialog'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { reportModalSlice } from '@/store/reducers/ReportModalSlice'
import { ScrollArea } from '../ui/scroll-area'
import TextArea from 'react-textarea-autosize'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod';

const ReportModal = () => {

    const formSchema = z.object({
        content: z.string().min(1, ' '),
        title: z.string().min(1, ' ').max(12)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: '',
            title: ''
        },
    })

    const { isOpen, userId, docId } = useAppSelector(state => state.reports)
    const { onClose } = reportModalSlice.actions
    const dispatch = useAppDispatch()

    const params = useParams()

    const report = useMutation(api.documents.createReport)

    const [isLoading, setIsLoading] = useState(false)

    const onReport = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log(values)
            setIsLoading(true)
            await report({
                title: values.title,
                docId: params.docId as Id<'documents'>,
                content: values.content
            })
            toast.success('you created a report, now wait...')
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <Form {...form}>
            <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>

                <DialogContent className='min-w-[600px]'>
                    <form onSubmit={form.handleSubmit(onReport)}>


                        <DialogHeader className='text-xl font-semibold'>
                            Ask to unban yourself
                        </DialogHeader>
                        <DialogDescription className='flex flex-col gap-3 items-start w-full'>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl className='w-full'>
                                            <Input {...field} className='text-xl text-black focus-visible:border-none focus-within:ring-0 focus-within:ring-offset-0 outline-none focus-visible:right-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' />
                                        </FormControl>
                                        <FormDescription>Creater of this doc will see that text immediately.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className=' w-full'>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className='h-full w-full'>
                                            <FormLabel>Message</FormLabel>
                                            <ScrollArea className='w-full h-full max-h-[300px]'>
                                                <TextArea {...field} className='w-full p-3 min-h-[100px] py-2 h-[300px] text-black border resize-none text-xl font-semibold bg-transparent focus-within:ring-0 focus-within:ring-offset-0 outline-none focus-visible:right-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' />
                                            </ScrollArea>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </DialogDescription>
                        <div className='flex items-center justify-between w-full'>
                            <Button variant={'outline'}>Cancel</Button>
                            <Button disabled={isLoading} type='submit'>
                                {isLoading ? <Loader2 /> : <span>Submit</span>}
                            </Button>
                        </div>
                    </form>

                </DialogContent>


            </Dialog >

        </Form >

    )
}

export default ReportModal