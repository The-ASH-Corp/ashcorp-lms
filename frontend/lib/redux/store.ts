import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/lib/redux/features/auth/authSlice";
import { api } from "@/lib/redux/services/api";
import { courseReducer } from "./features/course/courseSlice";
import { categoryReducer } from "./features/category/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    category:categoryReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
