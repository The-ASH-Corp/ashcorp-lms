import { api } from "../../services/api";

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
  }),
});

export const { useCreateCategoryMutation } = categoryApi;