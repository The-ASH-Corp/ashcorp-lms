import { api } from "../../services/api";

interface Chapter {
  _id: string;
  title: string;
  courseId: string;
  description: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const chapterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChaptersByCourseId: builder.query<Chapter[], string>({
      query: (courseId) => `/chapters/get-chapter-by-course/${courseId}`,

      transformResponse:(respose:any)=>respose.data as Chapter[]
      ,
      providesTags:["Chapter"]
    }),
    createChapter: builder.mutation<Chapter, Partial<any> | FormData>({
      query: (body) => ({
        url: "/chapters/create-chapter",
        method: "POST",
        body,
        formData: body instanceof FormData,
      }),
      invalidatesTags: ["Chapter"],
    }),

    deleteChapter: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chapters/delete-chapter/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chapter"],
    }),
  }),
});
export const {
  useGetChaptersByCourseIdQuery,
  useCreateChapterMutation,
  useDeleteChapterMutation,
} = chapterApi;
