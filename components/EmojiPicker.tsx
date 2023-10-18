import React, { ReactNode } from 'react'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import Picker, { Theme } from 'emoji-picker-react'
import { useTheme } from 'next-themes'


interface EmojiPickerProps {
    onChange: (value: string) => void;
    children: ReactNode;
    asChild?: boolean;
}

export const EmojiPicker = ({
    onChange,
    children,
    asChild,
}: EmojiPickerProps) => {

    const { resolvedTheme } = useTheme()
    const currentTheme = resolvedTheme as keyof typeof themeMap

    const themeMap = {
        'dark': Theme.DARK,
        'light': Theme.LIGHT
    }

    const theme = themeMap[currentTheme]

    return (
        <Popover>
            <PopoverTrigger asChild={asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className='w-full'>
                <Picker height={350} theme={theme} onEmojiClick={data => onChange(data.emoji)} />
            </PopoverContent>
        </Popover>
    )
}
