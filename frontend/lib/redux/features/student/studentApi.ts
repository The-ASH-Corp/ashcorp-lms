import { api } from "../../services/api";

export interface ExamAttempt {
  examId?: string;
  courseId?: string;
  answers?: {
    questionIndex: number;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
  score?: number;
  totalMarks?: number;
  passMarks?: number;
  isPassed?: boolean;
  status?: string;
  reason?: string;
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

export interface PaginatedStudentResponse {
  data: Student[];
  pagination: {
    totalStudents: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface AdminPaymentRecord {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  paymentId: string;
  methodOfPayment: string;
  paymentTime: string | null;
  amount: number;
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

export interface UpdateStudentDTO {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export interface CouponPricingInfo {
  couponCode: string | null;
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
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

    updateStudent: builder.mutation<Student, { id: string; student: UpdateStudentDTO }>({
      query: ({ id, student }) => ({
        url: `/student/update-student/${id}`,
        method: "PATCH",
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
      transformResponse: (response: unknown) => (response as { data: Student }).data,
      invalidatesTags: ["Student"],
    }),

    getAllStudents: builder.query<Student[], void>({
      query: () => "/student/get-all-students",
      transformResponse: (response: unknown) => (response as { data: Student[] }).data,
      providesTags: ["Student"],
    }),

    getPaginatedStudents: builder.query<PaginatedStudentResponse, { page: number; limit: number; search?: string }>({
      query: ({ page, limit, search }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (search?.trim()) {
          params.set("search", search.trim());
        }

        return `/student/get-all-students?${params.toString()}`;
      },
      transformResponse: (response: PaginatedStudentResponse) => response,
      providesTags: ["Student"],
    }),

    getAdminPayments: builder.query<AdminPaymentRecord[], void>({
      query: () => "/student/payments",
      transformResponse: (response: unknown) => (response as { data: AdminPaymentRecord[] }).data,
      providesTags: ["Student"],
    }),

    getWishlist: builder.query<WishlistCourse[], void>({
      query: () => "/student/get-wishlist",
      transformResponse: (response: unknown) => (response as { data: WishlistCourse[] }).data,
      providesTags: ["Student"],
    }),

    addToWishlist: builder.mutation<unknown, { courseId: string }>({
      query: ({ courseId }) => ({
        url: "/student/add-to-wishlist",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Student"],
    }),

    removeFromWishlist: builder.mutation<unknown, { courseId: string }>({
      query: ({ courseId }) => ({
        url: "/student/remove-from-wishlist",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Student"],
    }),

    enrollCourse: builder.mutation<unknown, { courseId: string }>({
      query: ({ courseId }) => ({
        url: "/student/enroll-course",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Student", "User"],
    }),

    getMyCourses: builder.query<EnrolledCourse[], string | void>({
      query: (id) => (id ? `/student/my-courses?studentId=${id}` : "/student/my-courses"),
      transformResponse: (response: unknown) => (response as { data: EnrolledCourse[] }).data,
      providesTags: ["Student"],
    }),

    updateCourseProgress: builder.mutation<unknown, { courseId: string; progress: number }>({
      query: ({ courseId, progress }) => ({
        url: "/student/course-progress",
        method: "PATCH",
        body: { courseId, progress },
      }),
      invalidatesTags: ["Student", "User"],
    }),

    getStudentById: builder.query<Student, string>({
      query: (id) => `/student/get-student-by-Id/${id}`,
      transformResponse: (response: unknown) => (response as { data: Student }).data,
      providesTags: ["Student"],
    }),

    createOrder: builder.mutation<
      {
        success: boolean;
        data: {
          orderId: string;
          amount: number;
          currency: string;
          keyId: string;
          couponCode: string | null;
          baseAmount: number;
          discountAmount: number;
          finalAmount: number;
        };
      },
      { courseId: string; couponCode?: string }
    >({
      query: (body) => ({
        url: "/student/create-order",
        method: "POST",
        body,
      }),
    }),

    validateCoupon: builder.mutation<
      { success: boolean; data: CouponPricingInfo },
      { courseId: string; couponCode: string }
    >({
      query: (body) => ({
        url: "/student/validate-coupon",
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
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useBlockStudentMutation,
  useGetAllStudentsQuery,
  useGetPaginatedStudentsQuery,
  useGetAdminPaymentsQuery,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useEnrollCourseMutation,
  useGetMyCoursesQuery,
  useUpdateCourseProgressMutation,
  useGetStudentByIdQuery,
  useCreateOrderMutation,
  useValidateCouponMutation,
  useVerifyPaymentMutation,
} = studentApi;
