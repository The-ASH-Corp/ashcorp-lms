import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ExamAttempt } from "../student/studentApi";

export interface Certificate {
  courseId: string;
  link: string;
}

export interface PurchasedCourse {
  courseId: string;
  paymentId: string;
  methodOfPayment: string;
  paymentTime: string;
  amount: number;
}

export interface AuthUser {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  purchasedCourses?: PurchasedCourse[];
  certificates?: Certificate[];
  examAttempts?: ExamAttempt[];
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

interface AuthCredentialsPayload {
  token?: string | null;
  user?: AuthUser | null;
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthCredentialsPayload>) => {
      state.token = action.payload.token ?? null;
      state.user = action.payload.user ?? null;
    },
    Logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { Logout, setCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
