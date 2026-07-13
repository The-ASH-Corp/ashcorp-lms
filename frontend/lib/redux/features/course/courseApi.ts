import { api } from "../../services/api";
import { Course } from "./courseSlice";

interface CourseResponse {
  data: Course[];
}

interface singleCourseResponse {
  data: Course;
}


export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourse: builder.query<Course[], void>({
      query: () => "/course/all-course",
      transformResponse: (response: CourseResponse) => response.data,
      providesTags: ["Course"],
    }),

    getCourse: builder.query<Course, string>({
      query: (courseId) => `/course/${courseId}`,
      transformResponse: (response: singleCourseResponse) => response.data,
      providesTags: ["Course"],
    }),

    createCourse: builder.mutation<void, FormData>({
      query: (course) => ({
        url: "/course/create",
        method: "POST",
        body: course,
        formData: true,
      }),
      invalidatesTags: ["Course"],
    }),

    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/course/delete-course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const { useGetAllCourseQuery, useCreateCourseMutation, useGetCourseQuery } =
  courseApi;
