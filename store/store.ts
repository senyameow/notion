import { combineReducers, configureStore } from '@reduxjs/toolkit';
import searchModal from './reducers/SearchSlice'
import settingsSlice from './reducers/SettingsSlice';
import imageSlice from './reducers/ImageUploadSlice';
import userModalSlice from './reducers/UserModalSlice';
import reportModalSlice from './reducers/ReportModalSlice';
import docStatusSlice from './reducers/DocStatusSlice';
import adminRoleModalSlice from './reducers/ConfirmAdminRoleModalSlice';
import editReplySlice from './reducers/EditReplySlice';

const rootReducer = combineReducers({
    search: searchModal,
    settings: settingsSlice,
    cover: imageSlice,
    user: userModalSlice,
    reports: reportModalSlice,
    docStatus: docStatusSlice,
    admin: adminRoleModalSlice,
    editReply: editReplySlice,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer> // тип состояния
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch'] // тип нашего хранилища (теперь не сможем задиспатчить те actions, который не определили)

export const store = setupStore()
// это база
