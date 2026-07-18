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

    getExamByCourse: builder.query<void, string>({
      query: (courseId) => ({
        url: `/exam/get-exams-by-course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Exam"],
    }),

    deleteExam: builder.mutation<void, string>({
      query: (examId) => ({
        url: `/exam/delete-exam/${examId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exam"],
    }),
  }),
  
});

export const { useCreateExamMutation, useGetExamByCourseQuery, useDeleteExamMutation } = examApi;
