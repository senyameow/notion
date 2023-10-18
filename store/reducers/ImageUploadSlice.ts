import { Id } from "@/convex/_generated/dataModel";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from '@reduxjs/toolkit'

interface ImageUploadState {
    isOpen: boolean;
    id: Id<'documents'> | undefined;
}

const initialState: ImageUploadState = {
    isOpen: false,
    id: undefined,
}

export const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<Id<'documents'>>) {
            state.isOpen = true
            state.id = action.payload
        },
        onClose(state) {
            state.isOpen = false
            state.id = undefined
        },
        onToggle(state, action: PayloadAction<Id<'documents'>>) {
            state.isOpen = !state.isOpen
            state.id = action.payload
        },
    }
})

export default imageSlice.reducer