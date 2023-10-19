'use client'
import React from 'react'
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { useTheme } from 'next-themes';
import { useEdgeStore } from '@/lib/edgestore';
import { toast } from 'sonner';

interface EditorProps {
    editable?: boolean;
    initialContent?: string;
    onChange: (value: string) => void;
}

const Editor = ({ editable, initialContent, onChange }: EditorProps) => {

    const { resolvedTheme } = useTheme()
    const currentTheme = resolvedTheme as keyof typeof themeMap

    const { edgestore } = useEdgeStore()

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
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        onEditorContentChange: (editor => {
            onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
        }),
        uploadFile: onImageUpload
    });

    return <BlockNoteView theme={currentTheme} editor={editor} />;
}

export default Editor