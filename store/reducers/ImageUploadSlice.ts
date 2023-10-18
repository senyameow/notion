import { createSlice } from "@reduxjs/toolkit";

interface ImageUploadState {
    isOpen: boolean;
}

const initialState: ImageUploadState = {
    isOpen: false,
}

export const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        onOpen(state) {
            state.isOpen = true
        },
        onClose(state) {
            state.isOpen = false
        },
        onToggle(state) {
            state.isOpen = !state.isOpen
        },
    }
})

export default imageSlice.reducer