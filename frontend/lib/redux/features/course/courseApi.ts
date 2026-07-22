import { api } from "../../services/api";
import { AddReviewRequest, Course, CourseRating } from "./courseSlice";

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

    makeCourseFreeAndPublished: builder.mutation<Course, string>({
      query: (id) => ({
        url: `/course/make-free-publish/${id}`,
        method: "PATCH",
      }),
      transformResponse: (response: singleCourseResponse) => response.data,
      invalidatesTags: ["Course"],
    }),

    addReview: builder.mutation<Course, AddReviewRequest>({
      query: ({ courseId, rating, review }) => ({
        url: `/course/${courseId}/review`,
        method: "POST",
        body: {
          rating,
          review,
        },
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetAllCourseQuery,
  useCreateCourseMutation,
  useGetCourseQuery,
  useDeleteCourseMutation,
  useMakeCourseFreeAndPublishedMutation,
  useAddReviewMutation,
} = courseApi;
