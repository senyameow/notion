import { Search } from 'lucide-react'
import React from 'react'
import Action from './Action'

const UserActions = () => {
    return (
        <div className='w-full flex flex-col items-start '>
            <Action label='Search' onClick={() => { }} icon={Search} />
            <Action label='Search' onClick={() => { }} icon={Search} />
            <Action label='Search' onClick={() => { }} icon={Search} />
        </div>
    )
}

export default UserActions