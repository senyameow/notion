import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useState, useRef } from 'react';
import Textarea from 'react-textarea-autosize'

const CommentButton = ({ children }: React.PropsWithChildren) => {
    const [selectedText, setSelectedText] = useState('');
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const textRef = useRef(null);

    const handleSelection = () => {
        const selection = window.getSelection();
        if (selection) {
            const selectedText = selection.toString().trim();

            if (selectedText) {
                setSelectedText(selectedText);

                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

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

    const addComment = () => {
        // Implement your logic to add a comment to the selected text.
        // You can show a modal or a form for the user to add their comment.
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
                    <div className='border border-white z-[99999] w-72 rounded-md bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 min-h-[50px] h-full'>
                        <div className='flex flex-col gap-2'>
                            <h2 className='text-sm text-neutral-400'>Add a comment</h2>
                            <div className='w-full'>
                                <ScrollArea className='h-[100px]'>
                                    <Textarea placeholder='type here..' className='w-full p-3 min-h-[100px] py-2 h-[300px] placeholder:text-sm placeholder:text-gray-600 text-gray-400 border resize-none text-sm font-semibold bg-transparent focus-within:ring-0 focus-within:ring-offset-0 outline-none focus-visible:right-0 ring-0 focus-visible:ring-offset-0 ring-offset-0' />
                                </ScrollArea>
                            </div>
                            <div className='flex w-full items-center justify-between'>
                                <Button variant={'outline'} onClick={() => setSelectedText('')}>
                                    Cancel
                                </Button>
                                <Button className='text-sm w-fit ml-auto h-fit'>
                                    Submit
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
