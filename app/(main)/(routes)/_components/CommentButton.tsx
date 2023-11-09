import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { Loader2 } from 'lucide-react';
import React, { useState, useRef } from 'react';
import Textarea from 'react-textarea-autosize'
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';
import { useWindowSize } from 'usehooks-ts'

interface CommentButtonProps {
    children: React.ReactNode;
    userId: string;
    docId: Id<'documents'>
}

const CommentButton = ({ children, userId, docId }: CommentButtonProps) => {

    const isMobile = useMediaQuery('(max-width: 768px)')
    let windowSize = useWindowSize()

    const [selectedText, setSelectedText] = useState('');
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const textRef = useRef(null);

    const [content, setContent] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)

    const createComment = useMutation(api.documents.createComment)

    const handleSelection = () => {
        const selection = window.getSelection();
        if (selection) {
            const selectedText = selection.toString().trim();

            if (selectedText) {
                setSelectedText(selectedText);

                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                console.log(range)
                console.log(rect)
                console.log(windowSize.width, 'width now')

                // Calculate the position of the button relative to the selected text
                const position = {
                    top: rect.top - 30, // Adjust the top position as needed
                    left: rect.left + rect.width / 2,
                };

                setButtonPosition(position);
            } else {
                setSelectedText('');
            }
        }

    };

    const onSubmit = async () => {
        try {
            setIsSubmitting(true)
            await createComment({
                docId,
                content: content,
                commentLine: selectedText,
            })
        } catch (error) {
            toast.error('something went wrong. Check you Internet connection')
        } finally {
            setIsSubmitting(false)
            setSelectedText('')
            setContent('')
        }
    };

    return (
        <div>
            <div ref={textRef} onMouseUp={handleSelection} style={{ userSelect: 'text' }}>
                {children}
            </div>
            {selectedText && (
                <div
                    style={{
                        position: 'absolute',
                        top: buttonPosition.top - 30 + 'px',
                        left: buttonPosition.left + 'px',
                    }}
                >
                    <div className='border border-white z-[99999] w-96 rounded-md bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 min-h-[50px] h-full'>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-sm text-neutral-400'>Add a comment</h2>
                            <div className='w-full'>
                                <ScrollArea className='h-[150px]'>
                                    <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder='type here..' className='w-full p-3 min-h-[150px] py-2 h-[300px] placeholder:text-sm placeholder:text-gray-600 text-gray-400 border resize-none text-sm font-semibold bg-transparent focus-within:ring-0 focus-within:ring-offset-0 outline-none focus-visible:right-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' />
                                </ScrollArea>
                            </div>
                            <div className='flex w-full items-center justify-between'>
                                <Button variant={'outline'} onClick={() => setSelectedText('')}>
                                    Cancel
                                </Button>
                                <Button disabled={isSubmitting} onClick={onSubmit} className='text-sm w-fit ml-auto h-fit'>
                                    {isSubmitting ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Submit'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default CommentButton;
