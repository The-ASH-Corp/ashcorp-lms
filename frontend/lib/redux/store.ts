import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/lib/redux/features/auth/authSlice";
import { api } from "@/lib/redux/services/api";
import { courseReducer } from "./features/course/courseSlice";
import { categoryReducer } from "./features/category/categorySlice";
import { instructorReducer } from "./features/instructor/instructorSlice";
import { studentReducer } from "./features/student/studentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    category:categoryReducer,
    instructor:instructorReducer,
    student: studentReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
