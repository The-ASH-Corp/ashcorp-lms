"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle, Loader, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import type { Course } from "@/lib/redux/features/course/courseSlice";
import {
  useCreateExamMutation,
  useUpdateExamMutation,
  type CreateExamRequest,
} from "@/lib/redux/features/exam/examApi";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { examSchema } from "@/lib/validations/exam";

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  type: "multiple-choice" | "true-false";
  title: string;
  options: QuestionOption[];
}

interface ExamFormValues {
  courseId: string;
  title: string;
  duration: string;
  marksPerQuestion: string;
  passMarks: string;
  questions: Question[];
}

interface ExamFormProps {
  mode?: "create" | "edit";
  examId?: string;
  initialCourseId?: string;
  initialValues?: ExamFormValues | null;
}

const createQuestionId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function ExamForm({ mode = "create", examId, initialCourseId, initialValues }: ExamFormProps) {
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState(initialValues?.courseId ?? initialCourseId ?? "");
  const [examTitle, setExamTitle] = useState(initialValues?.title ?? "");
  const [duration, setDuration] = useState(initialValues?.duration ?? "");
  const [marksPerQuestion, setMarksPerQuestion] = useState(initialValues?.marksPerQuestion ?? "");
  const [passMarks, setPassMarks] = useState(initialValues?.passMarks ?? "");
  const [questions, setQuestions] = useState<Question[]>(initialValues?.questions ?? []);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const { data: courses, isLoading: isCoursesLoading, isError: isCoursesError } = useGetAllCourseQuery();
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const [updateExam, { isLoading: isUpdating }] = useUpdateExamMutation();

  const addMultipleChoiceQuestion = () => {
    const newQuestion: Question = {
      id: createQuestionId(),
      type: "multiple-choice",
      title: "",
      options: [
        { id: createQuestionId(), text: "", isCorrect: false },
        { id: createQuestionId(), text: "", isCorrect: false },
        { id: createQuestionId(), text: "", isCorrect: false },
        { id: createQuestionId(), text: "", isCorrect: false },
      ],
    };

    setQuestions((currentQuestions) => [...currentQuestions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const addTrueFalseQuestion = () => {
    const newQuestion: Question = {
      id: createQuestionId(),
      type: "true-false",
      title: "",
      options: [
        { id: createQuestionId(), text: "True", isCorrect: false },
        { id: createQuestionId(), text: "False", isCorrect: false },
      ],
    };

    setQuestions((currentQuestions) => [...currentQuestions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, title: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) => (question.id === questionId ? { ...question, title } : question)),
    );
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, text } : option,
              ),
            }
          : question,
      ),
    );
  };

  const toggleCorrect = (questionId: string, optionId: string) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId
                  ? { ...option, isCorrect: !option.isCorrect }
                  : { ...option, isCorrect: false },
              ),
            }
          : question,
      ),
    );
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions((currentQuestions) => currentQuestions.filter((question) => question.id !== questionId));
  };

  const handleSubmit = async () => {
    const payload: CreateExamRequest = {
      courseId: courseTitle,
      title: examTitle,
      duration: Number(duration),
      marksPerQuestion: Number(marksPerQuestion),
      passMarks: Number(passMarks),
      questions: questions.map((question) => ({
        type: question.type,
        title: question.title,
        options: question.options.map((option) => ({
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      })),
    };

    const validData = examSchema.safeParse({
      courseTitle,
      examTitle,
      duration,
      marksPerQuestion,
      passMarks,
      questions: payload.questions,
    });

    if (!validData.success) {
      toast.error(validData.error.message);
      return;
    }

    try {
      if (mode === "edit" && examId) {
        await updateExam({ examId, exam: payload }).unwrap();
        toast.success("Exam updated successfully");
      } else {
        await createExam(payload).unwrap();
        toast.success("Exam created successfully");
      }

      router.push("/admin/exam");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {mode === "edit" ? "Edit Exam" : "Create Exam"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "edit"
                ? "Update the exam details and questions below."
                : "Create a new exam with questions and answer options."}
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Course
              </Label>

              <Select value={courseTitle} onValueChange={(value) => setCourseTitle(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {isCoursesLoading ? (
                      <div className="flex items-center justify-center px-4 py-3">
                        <Loader className="h-4 w-4 animate-spin" />
                      </div>
                    ) : isCoursesError ? (
                      <p className="px-4 py-3 text-sm text-red-600">Unable to load courses.</p>
                    ) : (
                      (courses as Array<Course & { _id?: string }>)?.map((course) => {
                        const courseValue = course.id ?? course._id ?? course.title;

                        return (
                          <SelectItem key={courseValue} value={courseValue}>
                            {course.title}
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Exam Title
              </Label>
              <Input
                type="text"
                placeholder="Enter exam title"
                value={examTitle}
                onChange={(event) => setExamTitle(event.target.value)}
                className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Duration (in Minutes)
              </Label>
              <Input
                type="number"
                placeholder="Enter exam duration"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Marks Per Question
              </Label>
              <Input
                type="number"
                placeholder="Enter marks per question"
                value={marksPerQuestion}
                onChange={(event) => setMarksPerQuestion(event.target.value)}
                className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Pass Marks
              </Label>
              <Input
                type="number"
                placeholder="Enter marks required to pass"
                value={passMarks}
                onChange={(event) => setPassMarks(event.target.value)}
                className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions</h2>
          <p className="text-gray-600 text-sm mb-6">
            Build your exam structure by adding various question types.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              onClick={addMultipleChoiceQuestion}
              className="flex h-10 items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Add Multiple Choice Question</span>
            </Button>
            <Button
              onClick={addTrueFalseQuestion}
              className="flex h-10 items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Add True/False Question</span>
            </Button>
          </div>

          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                  className="w-full h-10 px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {question.type === "multiple-choice"
                        ? "QUESTION TITLE (CAN ADD MULTIPLE CHOICE.)"
                        : "TRUE/FALSE QUESTION"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteQuestion(question.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Button>

                {expandedQuestion === question.id && (
                  <div className="px-6 py-6 bg-white border-t border-gray-200 space-y-4">
                    <div>
                      <textarea
                        placeholder="Enter question text"
                        value={question.title}
                        onChange={(event) => updateQuestion(question.id, event.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400 min-h-24 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {question.options.map((option, optionIndex) => (
                        <div key={option.id} className="flex items-end gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                              Option {String.fromCharCode(65 + optionIndex)}
                            </label>
                            <Input
                              type="text"
                              placeholder="Enter option text"
                              value={option.text}
                              onChange={(event) => updateOption(question.id, option.id, event.target.value)}
                              className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={() => toggleCorrect(question.id, option.id)}
                              className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-600 cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">
                              Correct
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 text-sm" />
          <Button
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
            className="flex h-10 items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium disabled:opacity-50"
          >
            {(isCreating || isUpdating) ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <CheckCircle size={20} />
            )}
            {isCreating || isUpdating ? (mode === "edit" ? "Updating..." : "Creating...") : mode === "edit" ? "Update Exam" : "Create Exam"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CreateExamPage() {
  return <ExamForm mode="create" />;
}
