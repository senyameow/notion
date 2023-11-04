import { Id } from "@/convex/_generated/dataModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface deleteCommentModalState {
    isOpen: boolean;
    commentId: Id<'comments'> | undefined
}

const initialState: deleteCommentModalState = {
    isOpen: false,
    commentId: undefined
}

interface PayloadActionEdit {
    commentId: Id<'comments'>
}

export const deleteCommentModalSlice = createSlice({
    name: 'deleteCommentModal',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<PayloadActionEdit>) {
            state.isOpen = true;
            state.commentId = action.payload.commentId

        },
        onClose(state) {
            state.isOpen = false;
            state.commentId = undefined;
        }
    }
})

export default deleteCommentModalSlice.reducer