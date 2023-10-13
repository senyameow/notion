import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronsLeft, LucideChevronLeft } from 'lucide-react'
import React, { ElementRef, useRef, useState } from 'react'

const Navbar = () => {

    const isResizingRef = useRef<ElementRef<'aside'>>(null)
    const sidebarRef = useRef<ElementRef<'aside'>>(null)
    const navbarRef = useRef<ElementRef<'aside'>>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isResetting, setIsResetting] = useState(false)

    return (
        <aside className='w-60 bg-secondary overflow-y-auto flex flex-col z-[99999] group/sidebar relative h-full'>
            <div className='absolute hover:bg-neutral-400 dark:hover:text-dark flex items-center justify-center w-6 h-6 rounded-lg top-3 right-4 hover cursor-pointer text-neutral-400 opacity-0 group-hover/sidebar:opacity-100 transition hover:bg-'>
                <ChevronsLeft className='w-5 h-5' />
            </div>
            <div>
                <p>actions</p>
            </div>
            <div>
                <p>docs</p>
            </div>
            <div className='group-hover/sidebar:opacity-100 opacity-0 cursor-ew-resize w-1 bg-primary/10 transition h-full absolute right-0 top-0' />
        </aside>
    )
}

export default Navbar