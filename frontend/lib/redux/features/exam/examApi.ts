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
  }),
});

export const { useCreateExamMutation } = examApi;
