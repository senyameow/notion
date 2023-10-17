import { combineReducers, configureStore } from '@reduxjs/toolkit';
import modalSlice from './reducers/ModalSlice';

const rootReducer = combineReducers({
    modal: modalSlice
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
