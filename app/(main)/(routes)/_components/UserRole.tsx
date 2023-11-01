import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority'
import { Edit, Eye, Flag, ShieldCheck } from 'lucide-react'
import React from 'react'



export enum UserRoles {
    VISITER = 'VISITER',
    ADMIN = 'ADMIN',
    MOD = 'MOD',
    EDITOR = 'EDITOR'
}

interface userRoleProps {
    role: UserRoles
    className?: string;
}

const roleIconMap = {
    'VISITER': <Eye className='w-5 h-5' />,
    'ADMIN': <Flag className='w-5 h-5' />,
    'MOD': <ShieldCheck className='w-5 h-5' />,
    'EDITOR': <Edit className='w-5 h-5' />,
}

const UserRole = ({ role, className }: userRoleProps) => {
    return (
        <div className={cn(``, className)}>
            {roleIconMap[role]}
        </div>
    )
}

export default UserRole