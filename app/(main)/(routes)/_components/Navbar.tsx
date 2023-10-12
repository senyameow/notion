import React from 'react'

const Navbar = () => {
    return (
        <aside className='w-60 bg-secondary overflow-y-auto flex flex-col z-[99999] group/sidebar relative h-full'>
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