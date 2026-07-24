import { api } from "../../services/api";
import { AddReviewRequest, Course } from "./courseSlice";

interface CourseResponse {
  data: Course[];
}

interface singleCourseResponse {
  data: Course;
}

interface PaginatedCourseResponse {
  data: Course[];
  pagination: {
    totalCourses: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
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

    getPaginatedCourses: builder.query<PaginatedCourseResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => `/course/all-course?page=${page}&limit=${limit}`,
      transformResponse: (response: PaginatedCourseResponse) => response,
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

    updateCourse: builder.mutation<Course, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/course/update-course/${id}`,
        method: "PATCH",
        body: formData,
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
  useGetPaginatedCoursesQuery,
  useCreateCourseMutation,
  useGetCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useMakeCourseFreeAndPublishedMutation,
  useAddReviewMutation,
} = courseApi;
