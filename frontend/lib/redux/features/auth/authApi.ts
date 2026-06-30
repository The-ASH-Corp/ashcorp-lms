import { api } from "@/lib/redux/services/api";
import { setCredentials, type AuthUser } from "@/lib/redux/features/auth/authSlice";

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: AuthUser;
  result?: AuthUser;
  data?: {
    token?: string;
    accessToken?: string;
    user?: AuthUser;
    result?: AuthUser;
  };
  message?: string;
}

const getAuthCredentials = (response: AuthResponse) => {
  const token = response.token ?? response.accessToken ?? response.data?.token ?? response.data?.accessToken ?? null;
  const user = response.user ?? response.result ?? response.data?.user ?? response.data?.result ?? null;

  return { token, user };
};

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(getAuthCredentials(data)));
        } catch {
          return;
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(getAuthCredentials(data)));
        } catch {
          return;
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    getCurrentUser: builder.query<AuthUser, void>({
      query: () => "/auth/me",
      transformResponse: (response: AuthUser | { data?: AuthUser }) => {
        return response as AuthUser;
      },
      providesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setCredentials({ token: null, user: null }));
        } catch {
          return;
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),
  }),

});

export const { useGetCurrentUserQuery, useLoginMutation, useRegisterMutation,useLogoutMutation } = authApi;
