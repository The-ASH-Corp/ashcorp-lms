import { api } from "../../services/api";

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  type: "multiple-choice" | "true-false";
  title: string;
  options: QuestionOption[];
}

export interface CreateExamRequest {
  courseId: string;
  title: string;
  duration: number;
  marksPerQuestion: number;
  passMarks: number;
  questions: Question[];
}

export interface Exam {
  _id?: string;
  id?: string;
  courseId: string;
  title: string;
  duration: number;
  marksPerQuestion: number;
  passMarks: number;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseExam {
  courseId: string;
  exams: Exam[];
}

export interface SaveExamResponseRequest {
  examId: string;
  courseId: string;
  answers: Record<number, number>;
  status: "submitted" | "stopped";
  reason?: string;
}

export interface ExamAttempt {
  examId: string;
  courseId: string;
  answers: {
    questionIndex: number;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
  score: number;
  totalMarks: number;
  passMarks: number;
  isPassed: boolean;
  status: "submitted" | "stopped";
  reason?: string;
  attemptedAt: string;
}

export const examApi = api.injectEndpoints({
  endpoints: (builder) => ({

    createExam: builder.mutation<void, CreateExamRequest>({
      query: (exam) => ({
        url: "/exam/create-exam",
        method: "POST",
        body: exam,
      }),
      invalidatesTags: ["Exam"],
    }),

    getExamByCourse: builder.query<{ success: boolean; data: Exam[] }, string>({
      query: (courseId) => ({
        url: `/exam/get-exams-by-course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Exam"],
    }),

    getExamsForCourses: builder.query<CourseExam[], string[]>({
      async queryFn(courseIds, _queryApi, _extraOptions, fetchWithBQ) {
        const uniqueCourseIds = Array.from(new Set(courseIds.filter(Boolean)));

        const results: CourseExam[] = [];

        for (const courseId of uniqueCourseIds) {
          const response = await fetchWithBQ(`/exam/get-exams-by-course/${courseId}`);

          if (response.error) {
            return { error: response.error };
          }

          const payload = response.data as { data?: Exam[] } | undefined;

          results.push({
            courseId,
            exams: payload?.data ?? [],
          });
        }

        return {
          data: results,
        };
      },
      providesTags: ["Exam"],
    }),

    deleteExam: builder.mutation<void, string>({
      query: (examId) => ({
        url: `/exam/delete-exam/${examId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exam"],
    }),

    updateExam: builder.mutation<Exam, { examId: string; exam: CreateExamRequest }>({
      query: ({ examId, exam }) => ({
        url: `/exam/update-exam/${examId}`,
        method: "PATCH",
        body: exam,
      }),
      invalidatesTags: ["Exam"],
    }),

    saveExamResponse: builder.mutation<
      { success: boolean; message: string; data: ExamAttempt },
      SaveExamResponseRequest
    >({
      query: (attempt) => ({
        url: "/student/exam-response",
        method: "POST",
        body: attempt,
      }),
      invalidatesTags: ["Exam", "User"],
    }),

    getExamAttempt: builder.query<
      { success: boolean; message: string; data: ExamAttempt | null },
      string
    >({
      query: (courseId) => ({
        url: `/student/exam-attempt/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Exam", "User"],
    }),

    uploadCertificate: builder.mutation<
      { success: boolean; message: string; data: { courseId: string; link: string; key: string } },
      { studentId: string; courseId: string; file: File }
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("studentId", data.studentId);
        formData.append("courseId", data.courseId);
        formData.append("file", data.file);

        return {
          url: "/exam/upload-certificate",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["User", "Student"],
    }),
  }),
});

export const {
  useCreateExamMutation,
  useGetExamByCourseQuery,
  useGetExamsForCoursesQuery,
  useDeleteExamMutation,
  useUpdateExamMutation,
  useSaveExamResponseMutation,
  useGetExamAttemptQuery,
  useUploadCertificateMutation,
} = examApi;
