'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronsLeft, File, Loader2, LucideChevronLeft, Menu, Plus, Trash } from 'lucide-react'
import React, { ElementRef, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import UserAction from './UserAction'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import UserActions from './UserActions'
import Doc from './Doc'
import DocList from './DocList'
import Action from './Action'
import { toast } from 'sonner'

import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import TrashBox from './TrashBox'
import { useParams } from 'next/navigation'
import DocNavbar from './DocNavbar'
import { useUser } from '@clerk/clerk-react'
import { UserRoles } from './UserRole'
import SettingsCommand from './SettingsCommand'

const Navbar = () => {
    const isMobile = useMediaQuery('(max-width: 768px)')

    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<'aside'>>(null)
    const navbarRef = useRef<ElementRef<'div'>>(null)
    const shtukaRef = useRef<ElementRef<'div'>>(null)
    const maxSizeRef = useRef<ElementRef<'div'>>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isResetting, setIsResetting] = useState(false)

    const params = useParams() // убиватель квадратных скобочек

    const create = useMutation(api.documents.create)

    const allDocs = useQuery(api.documents.getAllDocs)

    const { user, isLoaded } = useUser()

    const trash = useQuery(api.documents.getTrash)

    const onCreate = async () => {
        await create({ title: 'Untitled' })
        toast.success(`you've created new doc`)
    }

    useEffect(() => {
        setTimeout(() => {
            shtukaRef.current?.style.setProperty('height', `${sidebarRef.current?.scrollHeight}px`)
        }, 500);
    }, [shtukaRef])

    const resetWidth = () => {
        setIsResetting(true)
        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = isMobile ? '100%' : '240px' // на мобилке хотим на фулскрин открыть, а так просто 240px (начальная ширина)
            navbarRef.current.style.setProperty('width', isMobile ? `0` : 'calc(100% - 240px)')
            navbarRef.current.style.setProperty('left', isMobile ? '0' : '240px')
        }
        setTimeout(() => {
            setIsResetting(false)
        }, 300);
        setIsCollapsed(false)
    }
    const collapse = () => {
        setIsCollapsed(true)
        setIsResetting(true)
        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = '0px'
            navbarRef.current.style.setProperty('width', isMobile ? `0` : '100%')
            navbarRef.current.style.setProperty('left', '0')
        }
        setTimeout(() => {
            setIsResetting(false)
        }, 300);
        setIsCollapsed(true)
    }

    useEffect(() => {
        if (isMobile) {
            collapse()
        } else {
            resetWidth()
        }
    }, [isMobile])

    if (allDocs === undefined || !isLoaded) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Loader2 className='w-12 h-12 animate-spin' />
            </div>
        )
    }

    shtukaRef.current?.style.setProperty('height', `${maxSizeRef.current?.scrollHeight}px`)

    // console.log(allDocs)

    const allowedDocs = allDocs.filter(doc => doc.people?.some(human => (human.id === user?.id) && (human.role === 'MOD' || human.role === 'EDITOR')) && !doc.banList?.includes(user?.id!))

    // console.log(allowedDocs)


    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        isResizingRef.current = true

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizingRef.current) return
            let newWidth = e.clientX
            if (newWidth < 240) newWidth = 240
            if (newWidth > 480) newWidth = 480

            if (sidebarRef.current && navbarRef.current) {
                sidebarRef.current.style.width = `${newWidth}px`
                navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
                navbarRef.current.style.setProperty('left', `${newWidth}px`)
            }
        }

        const handleMouseUp = () => {
            isResizingRef.current = false
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

    }



    return (
        <>
            <SettingsCommand />
            <aside ref={sidebarRef} className={cn(`w-60 bg-secondary overflow-y-auto scrollbar scrollbar-thumb-black scrollbar-track-black scrollbar-none flex flex-col z-[99999] group/sidebar relative min-h-full`, isMobile && 'w-0', isResetting && 'transition-all duration-300 ease-[cubic-bezier(0.95,0.05,0.795,0.035)]')}>
                <div ref={maxSizeRef} className='min-h-full'>
                    <div onClick={collapse} className={cn(`absolute hover:bg-neutral-400 dark:hover:text-dark flex items-center justify-center w-6 h-6 rounded-lg top-3 right-4 hover cursor-pointer text-neutral-400 opacity-0 group-hover/sidebar:opacity-100 transition hover:bg-opacity-40`, isMobile && 'opacity-100 w-8 h-8')}>
                        <ChevronsLeft className={cn(`w-5 h-5`, isMobile && 'h-8 w-8')} />
                    </div>
                    <div className='pt-2 pl-2'>
                        <UserAction />
                    </div>
                    <div className='w-full py-2'>
                        <UserActions onResetWidth={resetWidth} onCollapse={collapse} userId={user?.id!} />
                    </div>
                    <div className='pt-2'>
                        <DocList userId={user?.id!} />
                        {/* <Action label='add new doc' icon={Plus} onClick={onCreate} /> */}
                    </div>
                    <div className='flex-1 text-sm font-medium text-neutral-500 px-2 py-4 flex flex-col gap-2'>
                        {allowedDocs.length > 0 && <span>You have access to:</span>}
                        <div className='flex flex-col '>
                            {allowedDocs.map(doc => (
                                <Doc access={UserRoles[doc.people?.find(human => human.id === user?.id)?.role!]} id={doc._id} title={doc.title} />
                            ))}
                        </div>
                    </div>
                    <Popover>
                        <PopoverTrigger className='w-full p-1 pt-4 pb-4'>
                            <Action isPomoyka label='Помойка' icon={Trash} />
                        </PopoverTrigger>
                        <PopoverContent className="w-56" side={isMobile ? 'bottom' : 'right'}>
                            <TrashBox docs={trash} />
                        </PopoverContent>
                    </Popover>
                    <div onMouseDown={handleMouseDown} ref={shtukaRef} onClick={resetWidth} className={cn(`group-hover/sidebar:opacity-100 opacity-0 cursor-ew-resize w-1 bg-primary/10 transition absolute right-0 top-0`)} />
                </div>
            </aside>
            <div className={cn(` w-[calc(100%-240px)] left-60 absolute top-0 z-[99999]`, isMobile && 'w-full left-0', isResetting && 'transition-all duration-300 ease-[cubic-bezier(0.95,0.05,0.795,0.035)]')} ref={navbarRef}>
                {!!params.docId ? (
                    <DocNavbar isMobile={isMobile} isCollapsed={isCollapsed} onResetWidth={resetWidth} />
                ) : <nav className=' px-3 py-4 w-full bg-transparent'>
                    <button disabled={!isCollapsed} onClick={resetWidth} className={cn(`w-fit h-fit p-2 hover:bg-transparent cursor-default`, isCollapsed && 'cursor-pointer')}>
                        <Menu className={cn(`w-6 h-6 dark:text-neutral-500 text-black opacity-0`, isCollapsed && 'opacity-100')} />
                    </button>
                </nav>}
            </div>
        </>
    )
}

export default Navbar