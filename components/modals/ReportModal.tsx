'use client'
import React from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { reportModalSlice } from '@/store/reducers/ReportModalSlice'

const ReportModal = () => {

    const { isOpen } = useAppSelector(state => state.reports)
    const { onClose } = reportModalSlice.actions
    const dispatch = useAppDispatch()

    return (
        <Dialog open={isOpen} onOpenChange={() => dispatch(onClose())}>
            <DialogContent className='min-w-[600px]'>

            </DialogContent>
        </Dialog >
    )
}

export default ReportModal