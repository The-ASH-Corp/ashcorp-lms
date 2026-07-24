import { api } from "../../services/api";

export interface ChapterContent {
  contentTitle: string;
  sequance: number;
  contentUrl: string;
  isFree: boolean;
  duration?: number;
}

export interface Chapter {
  _id: string;
  title: string;
  courseId: string;
  serialNumber: number;
  description: string;
  videoUrl: string;
  contents?: ChapterContent[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateChapterPayload {
  courseId?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  serialNumber?: number;
  contents?: ChapterContent[];
}

interface PaginatedChapterResponse {
  data: Chapter[];
  pagination: {
    totalChapters: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export const chapterApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getChaptersByCourseId: builder.query<Chapter[], string>({
      query: (courseId) => `/chapters/get-chapter-by-course/${courseId}`,
      transformResponse: (response: unknown) => (response as { data: Chapter[] }).data,
      providesTags: ["Chapter"],
    }),

    getPaginatedChaptersByCourseId: builder.query<PaginatedChapterResponse, { courseId: string; page: number; limit: number; search?: string }>({
      query: ({ courseId, page, limit, search }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search?.trim()) {
          params.set("search", search.trim());
        }

        return `/chapters/get-chapter-by-course/${courseId}?${params.toString()}`;
      },
      transformResponse: (response: PaginatedChapterResponse) => response,
      providesTags: ["Chapter"],
    }),

    createChapter: builder.mutation<Chapter, Partial<Record<string, unknown>> | FormData>({
      query: (body) => ({
        url: "/chapters/create-chapter",
        method: "POST",
        body,
        formData: body instanceof FormData,
      }),
      invalidatesTags: ["Chapter"],
    }),

    updateChapter: builder.mutation<Chapter, { id: string; chapter: UpdateChapterPayload | FormData }>({
      query: ({ id, chapter }) => ({
        url: `/chapters/update-chapter/${id}`,
        method: "PATCH",
        body: chapter,
        formData: chapter instanceof FormData,
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
  useGetPaginatedChaptersByCourseIdQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
} = chapterApi;
