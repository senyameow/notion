'use client'
import * as React from "react"
import { ArrowUpDown, Check, CheckIcon, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import { useUser } from '@clerk/clerk-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const UserAction = () => {

    const { user } = useUser()

    const [position, setPosition] = React.useState('bottom')

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[95%] flex items-start justify-start bg-transparent hover:bg-dark focus-visible:ring-0 focus-visible:ring-offset-0 truncate">
                    <div className="w-[80%] flex items-center justify-between">
                        <div className="truncate">
                            {user?.fullName}
                        </div>
                        <ArrowUpDown className="w-5 h-5 text-neutral-500" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{String(user?.primaryEmailAddress)}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                    { }
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAction