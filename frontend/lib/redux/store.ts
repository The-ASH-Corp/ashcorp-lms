import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/lib/redux/features/auth/authSlice";
import { api } from "@/lib/redux/services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
