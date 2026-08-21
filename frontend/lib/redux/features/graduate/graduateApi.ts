import { api } from "../../services/api";

export interface Graduate {
  _id?: string;
  id?: string;
  image: string;
  featureOnLandingPage: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGraduatePayload {
  image: string;
  featureOnLandingPage?: boolean;
}

export interface UpdateGraduatePayload {
  id: string;
  image?: string;
  featureOnLandingPage?: boolean;
}

export interface PaginatedGraduateResponse {
  success: boolean;
  message: string;
  data: {
    graduates: Graduate[];
    totalGraduates: number;
  };
}

export const graduateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createGraduate: builder.mutation<Graduate, CreateGraduatePayload>({
      query: (payload) => ({
        url: "/graduate/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Graduate"],
    }),

    getAllGraduates: builder.query<Graduate[], void>({
      query: () => "/graduate/get-all",
      transformResponse: (response: { success: boolean; data: Graduate[] }) => response.data,
      providesTags: ["Graduate"],
    }),

    getPaginatedGraduates: builder.query<PaginatedGraduateResponse, { page: number; limit: number; search?: string }>({
      query: ({ page, limit, search }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search?.trim()) {
          params.set("search", search.trim());
        }

        return `/graduate/paginate?${params.toString()}`;
      },
      providesTags: ["Graduate"],
    }),

    getFeaturedGraduates: builder.query<Graduate[], void>({
      query: () => "/graduate/get-featured",
      transformResponse: (response: { success: boolean; data: Graduate[] }) => response.data,
      providesTags: ["Graduate"],
    }),

    getGraduateById: builder.query<Graduate, string>({
      query: (id) => `/graduate/get-by-id/${id}`,
      transformResponse: (response: { success: boolean; data: Graduate }) => response.data,
      providesTags: ["Graduate"],
    }),

    deleteGraduate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/graduate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Graduate"],
    }),

    toggleGraduateFeature: builder.mutation<Graduate, string>({
      query: (id) => ({
        url: `/graduate/toggle-feature/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Graduate"],
    }),

    updateGraduate: builder.mutation<Graduate, UpdateGraduatePayload>({
      query: ({ id, ...payload }) => ({
        url: `/graduate/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Graduate"],
    }),
  }),
});

export const {
  useCreateGraduateMutation,
  useGetAllGraduatesQuery,
  useGetPaginatedGraduatesQuery,
  useGetFeaturedGraduatesQuery,
  useGetGraduateByIdQuery,
  useDeleteGraduateMutation,
  useToggleGraduateFeatureMutation,
  useUpdateGraduateMutation,
} = graduateApi;
