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
  }),
});

export const { useGetChaptersByCourseIdQuery } = chapterApi;
