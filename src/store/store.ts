import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import accountReducer from './accountReducer';

const store = configureStore({
    reducer: {
        user: userReducer,
        accounts: accountReducer,
    },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
