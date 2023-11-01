'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { useOrigin } from '@/hooks/use-origin'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { Check, Copy, Dot, Globe, Loader2, X } from 'lucide-react'
import { Share } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface PublishButtonProps {
    doc: Doc<'documents'>
}

const PublishButton = ({ doc }: PublishButtonProps) => {

    const update = useMutation(api.documents.updateDoc)
    const [isPublishing, setIsPublishing] = useState(false)
    const origin = useOrigin()
    const [copied, setCopied] = useState(false)

    const url = `${origin}/preview/${doc._id}`

    const { user, isLoaded } = useUser()

    const userRole = doc.people?.find(human => human.id === user?.id)

    const onPublish = async () => {
        try {
            setIsPublishing(true)
            await update({
                id: doc._id,
                isPublished: true
            })
            toast.success(`anybody can visit this page and check Your note now`)
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsPublishing(false)
        }
    }
    const unPublish = async () => {
        try {
            setIsPublishing(true)
            await update({
                id: doc._id,
                isPublished: false
            })
            toast.success(`${doc.title} is private note now`)
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsPublishing(false)
        }
    }

    const onCopy = () => {
        window.navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success(`you've copied url to Your note`)
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    }

    return (
        <Popover>
            {isLoaded && doc.people?.find(human => human.id === user?.id)?.role === 'ADMIN' || doc.people?.find(human => human.id === user?.id)?.role === 'MOD' && <PopoverTrigger>
                <Button variant={'ghost'}>Share</Button>
            </PopoverTrigger>}
            <PopoverContent className='w-[400px]'>
                <div className='w-full flex items-center border-b px-3 pb-2'>
                    <span>Publish</span>
                    {doc.isPublished && <Check className='w-4 h-4 ml-2 text-blue-400' />}
                </div>
                {doc.isPublished && <div className='flex items-center gap-1'>
                    <Dot className='w-12 h-12 text-rose-500 animate-pulse' />
                    <span className='text-sm'>This page is live on the web</span>
                </div>}
                {doc.isPublished && (
                    <div className='pt-2 flex items-center'>
                        <Input className='ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 border rounded-l-lg h-8 bg-muted truncate cursor-default' value={url} disabled />
                        <Button variant={'outline'} onClick={onCopy} className='h-fit'>
                            {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                        </Button>
                    </div>
                )}
                <div className='pt-8 flex flex-col items-center gap-3 px-8 text-center pb-6'>
                    <Globe className='w-6 h-6' />
                    <span className='text-xl font-bold'>Publish to web</span>
                    <p className='dark:text-neutral-400 text-neutral-500 text-sm'>Publish a static website of this page. You can allow others to view, duplicate, and remix</p>
                </div>
                {doc.isPublished && (
                    <div className='py-4 w-full'>
                        <div>

                        </div>
                    </div>
                )}
                {!doc.isPublished && <Button disabled={isPublishing} onClick={onPublish} className='w-full' variant={'ghost'}>
                    {isPublishing ? <Loader2 className='2-4 h-4 mr-2 animate-spin' /> : <Share className='w-4 h-4 mr-2' />}
                    Publish
                </Button>}
                {doc.isPublished && <Button disabled={isPublishing} onClick={unPublish} className='w-full' variant={'ghost'}>
                    {isPublishing ? <Loader2 className='2-4 h-4 mr-2 animate-spin' /> : <X className='w-4 h-4 mr-2' />}
                    Unpublish
                </Button>}
            </PopoverContent>
        </Popover>
    )
}

export default PublishButton