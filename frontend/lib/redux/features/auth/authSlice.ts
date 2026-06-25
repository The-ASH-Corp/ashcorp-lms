import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
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
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { logout, setCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
