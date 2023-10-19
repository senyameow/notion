import { Id } from "@/convex/_generated/dataModel";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from '@reduxjs/toolkit'

interface ImageUploadState {
    isOpen: boolean;
    id: Id<'documents'> | undefined;
    cover_image: string | undefined;
    type: 'change' | 'add';
    image_url?: string;
}

const initialState: ImageUploadState = {
    isOpen: false,
    id: undefined,
    cover_image: undefined,
    type: 'add',
    image_url: undefined,
}

export type ImageUploadPayload = {
    id: Id<'documents'>;
    type: 'change' | 'add';
    url?: string | undefined
}

export const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        onOpen(state, action: PayloadAction<ImageUploadPayload>) {
            state.isOpen = true
            state.id = action.payload.id
            state.type = action.payload.type
            state.image_url = action.payload.url
        },
        onClose(state) {
            state.isOpen = false
            state.id = undefined
            state.type = 'add'
            state.image_url = undefined
        },
        onToggle(state, action: PayloadAction<Id<'documents'>>) {
            state.isOpen = !state.isOpen
            state.id = action.payload
        },
        onStore(state, action: PayloadAction<string>) {
            state.cover_image = action.payload
        }
    }
})

export default imageSlice.reducer