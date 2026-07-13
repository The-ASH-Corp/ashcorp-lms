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
            transformResponse: (response: any) => response.data as Instructor,
            invalidatesTags: ["Instructor"],
        }),

        getAllInstructors: builder.query<Instructor[], void>({
            query: () => "/instructor/get-all-instructors",
            transformResponse: (response: any) => response.data as Instructor[],
            providesTags: ["Instructor"],
        }),

        
    })
})

export const {
  useCreateInstructorMutation,
  useDeleteInstructorMutation,
  useBlockInstructorMutation,
  useGetAllInstructorsQuery,
} = instructorApi;
