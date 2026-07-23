"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ExamForm } from "@/components/admin/exam/exam-form";
import { useGetExamByCourseQuery } from "@/lib/redux/features/exam/examApi";

export default function EditExamPage() {
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const examId = params?.id ?? "";
  const courseId = searchParams.get("courseId") ?? "";
  const { data: examsResponse, isLoading } = useGetExamByCourseQuery(courseId, { skip: !courseId });

  const initialValues = useMemo(() => {
    if (!examsResponse?.data?.length || !examId) {
      return null;
    }

    const matchingExam = examsResponse.data.find((item) => item._id === examId || item.id === examId);

    if (!matchingExam) {
      return null;
    }

    return {
      courseId: matchingExam.courseId ?? courseId,
      title: matchingExam.title ?? "",
      duration: String(matchingExam.duration ?? ""),
      marksPerQuestion: String(matchingExam.marksPerQuestion ?? ""),
      passMarks: String(matchingExam.passMarks ?? ""),
      questions: matchingExam.questions.map((question, questionIndex) => ({
        id: `${examId}-${questionIndex}`,
        type: question.type,
        title: question.title,
        options: question.options.map((option, optionIndex) => ({
          id: `${examId}-${questionIndex}-${optionIndex}`,
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      })),
    };
  }, [courseId, examId, examsResponse]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
          Loading exam details...
        </div>
      </div>
    );
  }

  return <ExamForm mode="edit" examId={examId} initialCourseId={courseId} initialValues={initialValues} />;
}
