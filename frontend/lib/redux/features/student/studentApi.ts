import { api } from "../../services/api";

export interface Student {
  _id: string;
  name: string;
  email: string;
  phone: number;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStudentDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  verifyByDefault?: boolean;
}

export const studentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStudent: builder.mutation<void, CreateStudentDTO>({
      query: (student) => ({
        url: "/student/create-student",
        method: "POST",
        body: student,
      }),
      invalidatesTags: ["Student"],
    }),

    getAllStudents: builder.query<Student[], void>({
      query: () => "/student/get-all-students",
      transformResponse: (response: any) => response.data as Student[],
      providesTags: ["Student"],
    }),
  }),
});

export const { useCreateStudentMutation, useGetAllStudentsQuery } = studentApi;
