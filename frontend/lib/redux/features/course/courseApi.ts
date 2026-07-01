import { api } from "../../services/api";
import { Course } from "./courseSlice";

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourse: builder.query<Course[], void>({
      query: () => "/course/all-course",
      transformResponse:(response:any) => response.data as Course[],
      providesTags: ["Course"],
    }),
  }),
});

export const { useGetAllCourseQuery } = courseApi;