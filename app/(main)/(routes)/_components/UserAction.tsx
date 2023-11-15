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
import { SignOutButton, useUser } from '@clerk/clerk-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"


const UserAction = () => {

    const { user } = useUser()

    // const [position, setPosition] = React.useState('bottom')

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-fit flex items-start justify-start bg-transparent hover:bg-dark focus-visible:ring-0 focus-visible:ring-offset-0 truncate">
                    <div className="w-full flex items-center gap-4 justify-between">
                        <div className="truncate flex gap-2 items-center">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={user?.imageUrl} />
                            </Avatar>
                            {user?.fullName}
                        </div>
                        <ChevronsUpDown className="w-5 h-5 text-neutral-500" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" alignOffset={30} forceMount className="w-80">
                <DropdownMenuLabel>{String(user?.primaryEmailAddress)}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="flex items-center p-1 flex-col">
                    <DropdownMenuItem className="cursor-pointer hover:opacity-90 w-full">
                        <p>{user?.firstName}&apos; notion</p>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="w-full" />

                    <DropdownMenuItem className="w-full cursor-pointer ">
                        <SignOutButton>
                            Log out
                        </SignOutButton>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAction