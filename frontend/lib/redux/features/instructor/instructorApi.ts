import { api } from "../../services/api";

export interface Instructor {
    _id: string;
    name: string;
    email: string;
    phone: string;
    instructorTitle: string;
    about: string;
    profileImage: string;
    isFeatured: boolean;
    verifyByDefault: boolean;
    createdAt: string;
    updatedAt: string;
    status: string;
}

export interface PaginatedInstructorResponse {
    data: Instructor[];
    pagination: {
        totalInstructors: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export const instructorApi = api.injectEndpoints({
    endpoints: (builder) => ({

        createInstructor: builder.mutation<void, FormData>({
            query: (instructor) => ({
                url: "/instructor/create-instructor",
                method: "POST",
                body: instructor,
                formData: true,
            }),
            invalidatesTags: ["Instructor"],
        }),

        updateInstructor: builder.mutation<Instructor, { id: string; instructor: FormData }>({
            query: ({ id, instructor }) => ({
                url: `/instructor/update-instructor/${id}`,
                method: "PATCH",
                body: instructor,
                formData: true,
            }),
            invalidatesTags: ["Instructor"],
        }),

        deleteInstructor: builder.mutation<void, string>({
            query: (id) => ({
                url: `/instructor/delete-instructor/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Instructor"],
        }),

        blockInstructor: builder.mutation<Instructor, string>({
            query: (id) => ({
                url: `/instructor/block-instructor/${id}`,
                method: "PATCH",
            }),
            transformResponse: (response: { data?: Instructor }) => response.data as Instructor,
            invalidatesTags: ["Instructor"],
        }),

        getAllInstructors: builder.query<Instructor[], void>({
            query: () => "/instructor/get-all-instructors",
            transformResponse: (response: { data?: Instructor[] }) => response.data as Instructor[],
            providesTags: ["Instructor"],
        }),

        getPaginatedInstructors: builder.query<PaginatedInstructorResponse, { page: number; limit: number; search?: string }>({
            query: ({ page, limit, search }) => {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (search?.trim()) {
                    params.set("search", search.trim());
                }

                return `/instructor/get-all-instructors?${params.toString()}`;
            },
            transformResponse: (response: PaginatedInstructorResponse) => response,
            providesTags: ["Instructor"],
        }),

        getInstructorById: builder.query<{ success: boolean; data: Instructor }, string>({
            query: (id) => `/instructor/get-instructor/${id}`,
            providesTags: ["Instructor"],
        }),

        
    })
})

export const {
  useCreateInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
  useBlockInstructorMutation,
  useGetAllInstructorsQuery,
  useGetPaginatedInstructorsQuery,
  useGetInstructorByIdQuery,
} = instructorApi;
