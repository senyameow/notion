import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
    isOpen: boolean;
}

const initialState: ModalState = {
    isOpen: false,
}

export const modalSlice = createSlice({
    name: 'modal',
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

export default modalSlice.reducer