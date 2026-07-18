"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import { useCreateExamMutation } from "@/lib/redux/features/exam/examApi";
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

export default function CreateExam() {
  const [courseTitle, setCourseTitle] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [marksPerQuestion, setMarksPerQuestion] = useState("");
  const [passMarks, setPassMarks] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const { data: courses, isLoading, isError } = useGetAllCourseQuery();
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const router = useRouter();

  const addMultipleChoiceQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple-choice",
      title: "",
      options: [
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
        { id: "3", text: "", isCorrect: false },
        { id: "4", text: "", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const addTrueFalseQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "true-false",
      title: "",
      options: [
        { id: "1", text: "True", isCorrect: false },
        { id: "2", text: "False", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, title: string) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, title } : q)),
    );
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, text } : o,
              ),
            }
          : q,
      ),
    );
  };

  const toggleCorrect = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId
                  ? { ...o, isCorrect: !o.isCorrect }
                  : { ...o, isCorrect: false },
              ),
            }
          : q,
      ),
    );
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleCreateExam = async () => {
  
    const validData = examSchema.safeParse({
      courseTitle,
      examTitle,
      duration,
      marksPerQuestion,
      passMarks,
      questions,
    });

    if (!validData.success) {
      toast.error(validData.error.message);
      return;
    }

    try {
      await createExam({
        courseId: courseTitle,
        title: examTitle,
        duration: Number(duration),
        marksPerQuestion: Number(marksPerQuestion),
        passMarks: Number(passMarks),
        questions: questions.map((q) => ({
          type: q.type,
          title: q.title,
          options: q.options.map((o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        })),
      }).unwrap();
      toast.success("Exam created successfully");
      router.push("/admin/exam");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12">
        {/* Form Fields */}
        <div className="space-y-6 mb-10">
          {/* Row 1: Course, Exam Title, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Course */}
            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Course
              </Label>
             
              <Select
                items={
                  courses?.map((course: any) => ({
                    value: course.id,
                    label: course.title,
                  }))
                }
                value={courseTitle}
                onValueChange={(value) => setCourseTitle(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Courses</SelectLabel>
                    {isLoading ? (
                      <Loader />
                    ) : (
                      courses?.map((course: any) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Exam Title */}
            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Exam Title
              </Label>
              <Input
                type="text"
                placeholder="Enter exam title"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Duration */}
            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Duration (in Minutes)
              </Label>
              <Input
                type="number"
                placeholder="Enter exam duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Row 2: Marks Per Question, Pass Marks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Marks Per Question */}
            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Marks Per Question
              </Label>
              <Input
                type="number"
                placeholder="Enter marks per question"
                value={marksPerQuestion}
                onChange={(e) => setMarksPerQuestion(e.target.value)}
                className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Pass Marks */}
            <div>
              <Label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Pass Marks
              </Label>
              <Input
                type="number"
                placeholder="Enter marks required to pass"
                value={passMarks}
                onChange={(e) => setPassMarks(e.target.value)}
                className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Questions</h2>
          <p className="text-gray-600 text-sm mb-6">
            Build your exam structure by adding various question types.
          </p>

          {/* Add Question Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              onClick={addMultipleChoiceQuestion}
              className="flex h-10 items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              <Plus size={20} />
              <span> Add Multiple Choice Question</span>
            </Button>
            <Button
              onClick={addTrueFalseQuestion}
              className="flex h-10 items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Add True/False Question</span>
            </Button>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Question Header */}
                <Button
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id,
                    )
                  }
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
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(question.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Button>

                {/* Question Content */}
                {expandedQuestion === question.id && (
                  <div className="px-6 py-6 bg-white border-t border-gray-200 space-y-4">
                    {/* Question Title */}
                    <div>
                      <textarea
                        placeholder="Enter question text"
                        value={question.title}
                        onChange={(e) =>
                          updateQuestion(question.id, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400 min-h-24 resize-none"
                      />
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {question.options.map((option, optIndex) => (
                        <div key={option.id} className="flex items-end gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                              Option {String.fromCharCode(65 + optIndex)}
                            </label>
                            <Input
                              type="text"
                              placeholder="Enter option text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  option.id,
                                  e.target.value,
                                )
                              }
                              className="w-full h-10 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-600 focus:ring-opacity-10 text-gray-900 placeholder-gray-400"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={() =>
                                toggleCorrect(question.id, option.id)
                              }
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

        {/* Footer Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 text-sm"></div>
          <Button
            onClick={() => handleCreateExam()}
            disabled={isCreating}
            className="flex h-10 items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium disabled:opacity-50"
          >
            {isCreating ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <CheckCircle size={20} />
            )}
            {isCreating ? "Creating..." : "Create Exam"}
          </Button>
        </div>
      </div>
    </div>
  );
}
