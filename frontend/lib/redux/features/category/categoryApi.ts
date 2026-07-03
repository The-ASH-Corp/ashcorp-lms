import { api } from "../../services/api";

export interface Category {
  _id: string;
  categoryName: string;
  color: string;
  iconUrl: string;
  isFeatured: boolean;
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
      transformResponse:(response:any) => response.data as Category[],
      providesTags: ["Category"],
    }),
  }),
});

export const { useCreateCategoryMutation, useGetAllCategoriesQuery } = categoryApi;