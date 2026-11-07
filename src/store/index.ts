import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
