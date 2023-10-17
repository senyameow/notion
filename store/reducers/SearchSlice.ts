import { createSlice } from "@reduxjs/toolkit";

interface searchState {
    isOpen: boolean;
}

const initialState: searchState = {
    isOpen: false,
}

export const searchSlice = createSlice({
    name: 'search',
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

export default searchSlice.reducer