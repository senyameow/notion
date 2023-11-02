import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface editReplyState {
    isOpen: boolean;
    replyId: string | null;
    content: string;
}

const initialState: editReplyState = {
    isOpen: false,
    replyId: null,
    content: ''
}

interface PayloadActionEdit {
    replyId: string | null;
    content: string;
}

export const editReplySlice = createSlice({
    name: 'editReply',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<PayloadActionEdit>) {
            state.isOpen = true;
            state.replyId = action.payload.replyId;
            state.content = action.payload.content

        },
        onClose(state) {
            state.isOpen = false;
            state.replyId = null;
        }
    }
})

export default editReplySlice.reducer