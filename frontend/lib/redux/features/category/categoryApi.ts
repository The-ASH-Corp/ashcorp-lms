import { api } from "../../services/api";

export interface Category {
  _id: string;
  categoryName: string;
  color: string;
  iconUrl: string;
  isFeatured: boolean;
  status: string;
}

interface PaginatedCategoryResponse {
  data: Category[];
  pagination: {
    totalCategories: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<void, FormData>({
      query: (category) => ({
        url: "/category/create",
        method: "POST",
        body: category,
        formData: true,
      }),
      invalidatesTags: ["Category"],
    }),

    getAllCategories: builder.query<Category[], void>({
      query: () => "/category/all-categories",
      transformResponse: (response: { data: Category[] }) => response.data,
      providesTags: ["Category"],
    }),

    getPaginatedCategories: builder.query<PaginatedCategoryResponse, { page: number; limit: number; search?: string }>({
      query: ({ page, limit, search }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search?.trim()) {
          params.set("search", search.trim());
        }

        return `/category/all-categories?${params.toString()}`;
      },
      transformResponse: (response: PaginatedCategoryResponse) => response,
      providesTags: ["Category"],
    }),

    updateCategory: builder.mutation<void, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/category/update-category/${id}`,
        method: "PATCH",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/category/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetPaginatedCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
