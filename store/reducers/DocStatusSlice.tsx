import { PayloadAction, createSlice } from "@reduxjs/toolkit";



interface docStatusState {
    isDeleting: boolean;
    isRestoring: boolean;
}

const initialState: docStatusState = {
    isDeleting: false,
    isRestoring: false,
}

export const docStatusSlice = createSlice({
    name: 'docStatus',
    initialState,
    reducers: {
        deleteStatus: (state, action: PayloadAction<boolean>) => {
            state.isDeleting = action.payload
        },
        restoreStatus: (state, action: PayloadAction<boolean>) => {
            state.isRestoring = action.payload
        }
    },
})

export default docStatusSlice.reducer