import { api } from "../../services/api";

export interface ExamAttempt {
  examId?: string;
  courseId?: string;
  score?: number;
  totalMarks?: number;
  passMarks?: number;
  isPassed?: boolean;
  status?: string;
  attemptedAt?: string;
}

export interface CertificateItem {
  courseId: string;
  link: string;
}

export interface PurchasedCourseItem {
  courseId: string;
  paymentId: string;
  methodOfPayment: string;
  paymentTime: string;
  amount: number;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  phone: number;
  role: string;
  status: string;
  purchasedCourses?: PurchasedCourseItem[];
  courseProgress?: Record<string, number>;
  certificates?: (CertificateItem | string)[];
  examAttempts?: ExamAttempt[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistCourse {
  _id?: string;
  title: string;
  description: string;
  price: number;
  offerPrice: number;
  instructor: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  chapters?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EnrolledCourse extends WishlistCourse {
  id: string;
  progress: number;
  isPublished: boolean;
  status: string;
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

    deleteStudent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/student/delete-student/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),

    blockStudent: builder.mutation<Student, string>({
      query: (id) => ({
        url: `/student/block-student/${id}`,
        method: "PATCH",
      }),
      transformResponse: (response: any) => response.data as Student,
      invalidatesTags: ["Student"],
    }),

    getAllStudents: builder.query<Student[], void>({
      query: () => "/student/get-all-students",
      transformResponse: (response: any) => response.data as Student[],
      providesTags: ["Student"],
    }),

    getWishlist: builder.query<WishlistCourse[], void>({
      query: () => "/student/get-wishlist",
      transformResponse: (response: any) => response.data as WishlistCourse[],
      providesTags: ["Student"],
    }),

    addToWishlist: builder.mutation<any, { courseId: string }>({
      query: ({ courseId }) => ({
        url: "/student/add-to-wishlist",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Student"],
    }),

    removeFromWishlist: builder.mutation<any, { courseId: string }>({
      query: ({ courseId }) => ({
        url: "/student/remove-from-wishlist",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Student"],
    }),

    enrollCourse: builder.mutation<any, { courseId: string }>({
      query: ({ courseId }) => ({
        url: "/student/enroll-course",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Student", "User"],
    }),

    getMyCourses: builder.query<EnrolledCourse[], string | void>({
      query: (id) => (id ? `/student/my-courses?studentId=${id}` : "/student/my-courses"),
      transformResponse: (response: any) => response.data as EnrolledCourse[],
      providesTags: ["Student"],
    }),

    updateCourseProgress: builder.mutation<any, { courseId: string; progress: number }>({
      query: ({ courseId, progress }) => ({
        url: "/student/course-progress",
        method: "PATCH",
        body: { courseId, progress },
      }),
      invalidatesTags: ["Student", "User"],
    }),

    getStudentById: builder.query<Student, string>({
      query: (id) => `/student/get-student-by-Id/${id}`,
      transformResponse: (response: any) => response.data as Student,
      providesTags: ["Student"],
    }),

    createOrder: builder.mutation<
      { success: boolean; data: { orderId: string; amount: number; currency: string; keyId: string } },
      { courseId: string }
    >({
      query: (body) => ({
        url: "/student/create-order",
        method: "POST",
        body,
      }),
    }),

    verifyPayment: builder.mutation<
      { success: boolean; message: string },
      { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
    >({
      query: (body) => ({
        url: "/student/verify-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Student", "User"],
    }),

  }),
});

export const {
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useBlockStudentMutation,
  useGetAllStudentsQuery,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useEnrollCourseMutation,
  useGetMyCoursesQuery,
  useUpdateCourseProgressMutation,
  useGetStudentByIdQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} = studentApi;
