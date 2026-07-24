import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/lib/redux/store";
import { Logout } from "@/lib/redux/features/auth/authSlice";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  console.error("Missing NEXT_PUBLIC_API_BASE_URL. Please set it in your environment variables.");
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: (() => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: apiBaseUrl,
      credentials: "include",
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
      },
    });

    const baseQueryWithAuthRedirect: BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError
    > = async (args, apiContext, extraOptions) => {
      const result = await rawBaseQuery(args, apiContext, extraOptions);

      if (result.error?.status === 401) {
        const state = apiContext.getState() as RootState;
        const hasAuthenticatedSession = Boolean(state.auth.user || state.auth.token);

        if (hasAuthenticatedSession) {
          apiContext.dispatch(Logout());
          apiContext.dispatch(api.util.resetApiState());

          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.replace("/login");
          }
        }
      }

      return result;
    };

    return baseQueryWithAuthRedirect;
  })(),
  tagTypes: ["Auth", "User", "Course", "Category", "Instructor", "Chapter", "Student", "Coupon", "Exam", "Graduate"],
  endpoints: () => ({}),
});
