import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/lib/redux/store";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  console.error("Missing NEXT_PUBLIC_API_BASE_URL. Please set it in your environment variables.");
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "User", "Course", "Category", "Instructor", "Chapter", "Student", "Coupon", "Exam"],
  endpoints: () => ({}),
});
