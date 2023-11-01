'use client'
import React from 'react'
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { useTheme } from 'next-themes';
import { useEdgeStore } from '@/lib/edgestore';
import { toast } from 'sonner';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';

interface EditorProps {
    editable?: boolean;
    initialContent?: string;
    onChange: (value: string) => void;
    docId: Id<'documents'>
}

const Editor = ({ editable, initialContent, onChange, docId }: EditorProps) => {

    const { resolvedTheme } = useTheme()
    const currentTheme = resolvedTheme as keyof typeof themeMap

    const { edgestore } = useEdgeStore()

    const doc = useQuery(api.documents.getNote, { id: docId })

    if (doc === undefined) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Loader2 className='w-12 h-12 animate-spin' />
            </div>
        )
    }

    if (doc === null) return redirect('/docs')

    const onImageUpload = async (file: File) => {
        try {
            const res = await edgestore.publicFiles.upload({
                file: file
            })
            return res.url
        } catch (error) {
            toast.error(`something went wrong`)
            return ''
        }
    }

    const themeMap = {
        'dark': 'dark',
        'light': 'light'
    }

    const editor: BlockNoteEditor | null = useBlockNote({
        editable,
        initialContent: doc.content ? JSON.parse(doc.content) as PartialBlock[] : undefined,
        onEditorContentChange: (editor => {
            onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
        }),
        uploadFile: onImageUpload
    });

    return <BlockNoteView theme={currentTheme} editor={editor} />;
}

export default Editor