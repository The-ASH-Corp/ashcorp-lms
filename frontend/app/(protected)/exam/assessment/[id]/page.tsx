"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { PropagateLoader } from "react-spinners";
import {
  useGetExamAttemptQuery,
  useGetExamByCourseQuery,
  useSaveExamResponseMutation,
} from "@/lib/redux/features/exam/examApi";
import type { Exam } from "@/lib/redux/features/exam/examApi";
import { useGetMyCoursesQuery } from "@/lib/redux/features/student/studentApi";

type AttemptStatus = "rules" | "active" | "submitted" | "stopped";

interface SavedAttempt {
  examId: string;
  courseId: string;
  answers: Record<number, number>;
  score: number;
  totalMarks: number;
  passMarks?: number;
  isPassed: boolean;
  status: "submitted" | "stopped";
  reason?: string;
  savedAt: string;
}

const DISCLAIMER_SECONDS = 15;
const optionLabels = ["A", "B", "C", "D", "E", "F"];

function getExamId(exam: Exam) {
  return exam._id ?? exam.id ?? exam.title;
}

function getAttemptStorageKey(courseId: string) {
  return `exam-attempt-${courseId}`;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getRandomExam(exams: Exam[], courseId: string) {
  if (exams.length === 0) return null;

  const savedExamId =
    typeof window === "undefined"
      ? ""
      : window.sessionStorage.getItem(`selected-exam-${courseId}`);
  const savedExam = exams.find((exam) => getExamId(exam) === savedExamId);

  if (savedExam) return savedExam;

  const selectedExam = exams[Math.floor(Math.random() * exams.length)];
  window.sessionStorage.setItem(`selected-exam-${courseId}`, getExamId(selectedExam));

  return selectedExam;
}

export default function ExamAssessment() {
  const params = useParams() as { id?: string };
  const courseId = params.id ?? "";
  const [status, setStatus] = useState<AttemptStatus>("rules");
  const [disclaimerSeconds, setDisclaimerSeconds] = useState(DISCLAIMER_SECONDS);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<SavedAttempt | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const hasStoppedAttempt = useRef(false);

  const {
    data: examResponse,
    isLoading: isExamLoading,
    isError: isExamError,
  } = useGetExamByCourseQuery(courseId, { skip: !courseId });
  const [saveExamResponse] = useSaveExamResponseMutation();
  const {
    data: savedExamAttemptResponse,
    isLoading: isSavedAttemptLoading,
  } = useGetExamAttemptQuery(courseId, { skip: !courseId });
  const { data: myCourses = [], isLoading: isCoursesLoading } = useGetMyCoursesQuery();

  const exams = examResponse?.data ?? [];
  const enrolledCourse = myCourses.find((course) => course.id === courseId);
  const isUnlocked = (enrolledCourse?.progress ?? 0) >= 100;
  const questions = selectedExam?.questions ?? [];
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const totalMarks = questions.length * (selectedExam?.marksPerQuestion ?? 0);

  const calculatedResult = useCallback(
    (nextStatus: "submitted" | "stopped", reason?: string): SavedAttempt | null => {
      if (!selectedExam) return null;

      const score = questions.reduce((total, question, questionIndex) => {
        const selectedOptionIndex = answers[questionIndex];
        const selectedOption = question.options[selectedOptionIndex];

        if (!selectedOption?.isCorrect) return total;

        return total + selectedExam.marksPerQuestion;
      }, 0);
      const nextResult: SavedAttempt = {
        examId: getExamId(selectedExam),
        courseId,
        answers,
        score,
        totalMarks,
        passMarks: selectedExam.passMarks,
        isPassed: score >= selectedExam.passMarks,
        status: nextStatus,
        reason,
        savedAt: new Date().toISOString(),
      };

      window.localStorage.setItem(getAttemptStorageKey(courseId), JSON.stringify(nextResult));

      return nextResult;
    },
    [answers, courseId, questions, selectedExam, totalMarks],
  );

  const finishExam = useCallback(
    (nextStatus: "submitted" | "stopped", reason?: string) => {
      if (hasStoppedAttempt.current) return;

      const nextResult = calculatedResult(nextStatus, reason);

      if (!nextResult) return;

      hasStoppedAttempt.current = true;
      setResult(nextResult);
      setStatus(nextStatus);

      saveExamResponse({
        examId: nextResult.examId,
        courseId: nextResult.courseId,
        answers: nextResult.answers,
        status: nextStatus,
        reason,
      })
        .unwrap()
        .then((response) => {
          const savedResult: SavedAttempt = {
            ...nextResult,
            score: response.data.score,
            totalMarks: response.data.totalMarks,
            passMarks: response.data.passMarks,
            isPassed: response.data.isPassed,
            savedAt: response.data.attemptedAt,
          };

          window.localStorage.setItem(getAttemptStorageKey(courseId), JSON.stringify(savedResult));
          setResult(savedResult);
        })
        .catch(() => {
          setResult({
            ...nextResult,
            reason: "Exam completed, but the result could not be saved. Please contact support.",
          });
        });
    },
    [calculatedResult, courseId, saveExamResponse],
  );

  useEffect(() => {
    if (!courseId) return;

    const savedAttempt = window.localStorage.getItem(getAttemptStorageKey(courseId));

    if (!savedAttempt) return;

    try {
      const parsedAttempt = JSON.parse(savedAttempt) as SavedAttempt;
      setResult(parsedAttempt);
      setStatus(parsedAttempt.status);
      hasStoppedAttempt.current = true;
    } catch {
      window.localStorage.removeItem(getAttemptStorageKey(courseId));
    }
  }, [courseId]);

  useEffect(() => {
    const savedAttempt = savedExamAttemptResponse?.data;

    if (!courseId || !savedAttempt?.isPassed) return;

    const answers = savedAttempt.answers.reduce<Record<number, number>>((nextAnswers, answer) => {
      if (answer.selectedOptionIndex >= 0) {
        nextAnswers[answer.questionIndex] = answer.selectedOptionIndex;
      }

      return nextAnswers;
    }, {});
    const savedResult: SavedAttempt = {
      examId: savedAttempt.examId,
      courseId: savedAttempt.courseId,
      answers,
      score: savedAttempt.score,
      totalMarks: savedAttempt.totalMarks,
      passMarks: savedAttempt.passMarks,
      isPassed: savedAttempt.isPassed,
      status: savedAttempt.status,
      reason: savedAttempt.reason,
      savedAt: savedAttempt.attemptedAt,
    };

    window.localStorage.setItem(getAttemptStorageKey(courseId), JSON.stringify(savedResult));
    setResult(savedResult);
    setStatus(savedAttempt.status);
    hasStoppedAttempt.current = true;
  }, [courseId, savedExamAttemptResponse]);

  useEffect(() => {
    if (selectedExam || exams.length === 0 || status === "submitted" || status === "stopped") {
      return;
    }

    const randomExam = getRandomExam(exams, courseId);
    setSelectedExam(randomExam);
    setRemainingSeconds((randomExam?.duration ?? 0) * 60);
  }, [courseId, exams, selectedExam, status]);

  useEffect(() => {
    if (status !== "rules") return;

    const countdown = window.setInterval(() => {
      setDisclaimerSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(countdown);
          setStatus("active");
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(countdown);
  }, [status]);

  useEffect(() => {
    if (status !== "active" || remainingSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(timer);
          finishExam("submitted", "Time completed.");
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finishExam, remainingSeconds, status]);

  useEffect(() => {
    if (status !== "active") return;

    const stopForLeavingScreen = () => {
      finishExam("stopped", "Exam stopped because the screen changed.");
    };
    const handleVisibilityChange = () => {
      if (document.hidden) stopForLeavingScreen();
    };
    const handleBeforeUnload = () => {
      const nextResult = calculatedResult("stopped", "Exam stopped because the page was closed.");

      if (nextResult) {
        hasStoppedAttempt.current = true;
      }
    };

    window.addEventListener("blur", stopForLeavingScreen);
    window.addEventListener("pagehide", stopForLeavingScreen);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", stopForLeavingScreen);
      window.removeEventListener("pagehide", stopForLeavingScreen);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [calculatedResult, finishExam, status]);

  const questionButtons = useMemo(
    () =>
      questions.map((_, index) => ({
        number: index + 1,
        isCurrent: index === currentQuestionIndex,
        isAnswered: answers[index] !== undefined,
      })),
    [answers, currentQuestionIndex, questions],
  );

  const goToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(Math.min(questions.length - 1, Math.max(0, questionIndex)));
  };

  const retryExam = () => {
    window.localStorage.removeItem(getAttemptStorageKey(courseId));
    window.sessionStorage.removeItem(`selected-exam-${courseId}`);
    hasStoppedAttempt.current = false;
    setStatus("rules");
    setDisclaimerSeconds(DISCLAIMER_SECONDS);
    setSelectedExam(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  const selectAnswer = (optionIndex: number) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  if (isExamLoading || isCoursesLoading || isSavedAttemptLoading) {
    return (
      <div className="flex min-h-[calc(100vh-170px)] items-center justify-center bg-white">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="flex min-h-[calc(100vh-170px)] items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
          <ShieldAlert className="mx-auto text-amber-600" size={36} />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Exam locked</h1>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            Complete the course video progress before attending this exam.
          </p>
          <Link
            href={`/play?courseId=${courseId}`}
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Continue Course
          </Link>
        </div>
      </div>
    );
  }

  if ((isExamError || exams.length === 0 || !selectedExam) && !result) {
    return (
      <div className="flex min-h-[calc(100vh-170px)] items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto text-primary" size={36} />
          <h1 className="mt-4 text-xl font-bold text-gray-900">No exam found</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            There is no question paper available for this course right now.
          </p>
          <Link
            href="/exam"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Back To Exams
          </Link>
        </div>
      </div>
    );
  }

  if (status === "rules") {
    return (
      <div className="flex min-h-[calc(100vh-170px)] items-center justify-center bg-white px-4">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-primary">
              <ShieldAlert size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Exam Rules
              </p>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                {selectedExam?.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your exam starts automatically in {disclaimerSeconds} second
                {disclaimerSeconds === 1 ? "" : "s"}.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-gray-700">
            <div className="rounded-xl bg-gray-50 p-4">
              Do not open a new tab, switch apps, refresh, or navigate away.
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              If the screen changes, the exam stops immediately and your current
              progress is saved.
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              Submit only when you are finished. Your marks and pass/fail result
              are shown after submission.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "submitted" || status === "stopped") {
    const displayResult = result ?? calculatedResult(status);

    return (
      <div className="flex min-h-[calc(100vh-170px)] items-center justify-center bg-white px-4">
        <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
          {displayResult?.isPassed ? (
            <CheckCircle2 className="mx-auto text-green-600" size={48} />
          ) : (
            <XCircle className="mx-auto text-red-600" size={48} />
          )}
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            {status === "stopped" ? "Exam Stopped" : "Exam Completed"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {displayResult?.isPassed ? "Passed" : "Failed"}
          </h1>
          {displayResult?.reason && (
            <p className="mt-2 text-sm text-gray-600">{displayResult.reason}</p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Score
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {displayResult?.score ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Total Marks
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {displayResult?.totalMarks ?? totalMarks}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Pass Marks
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {displayResult?.passMarks ?? selectedExam?.passMarks ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Answered
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {answeredCount}/{questions.length}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/exam"
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back To Exams
            </Link>
            {displayResult?.isPassed && (
              <Link
                href={`/certificate/${courseId}`}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Get Certificate
              </Link>
            )}
            {!displayResult?.isPassed && (
              <button
                type="button"
                onClick={retryExam}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Attend Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-170px)] lg:h-[calc(100vh-170px)] flex-col bg-white overflow-hidden rounded-2xl border border-gray-200">
      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8 shrink-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Assessment Mode
            </p>
            <h1 className="mt-1 text-xl font-bold text-gray-900">
              {selectedExam?.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
              <Clock size={18} className="text-gray-600" />
              <span className="font-mono text-base font-semibold text-gray-900">
                {formatTime(remainingSeconds)}
              </span>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              title="Do not leave this page during the exam."
            >
              <HelpCircle size={20} className="text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => finishExam("submitted")}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <aside className="w-full border-b border-gray-200 px-4 py-6 sm:px-6 lg:w-72 lg:border-b-0 lg:border-r lg:overflow-y-auto">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-primary">
              <span className="font-semibold text-primary">
                {currentQuestionIndex + 1}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Question {currentQuestionIndex + 1}
              </p>
              <p className="text-xs uppercase text-gray-600">
                Of {questions.length} questions
              </p>
            </div>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
            Jump to Question
          </p>
          <div className="grid grid-cols-5 gap-2">
            {questionButtons.map((questionButton, index) => (
              <button
                key={questionButton.number}
                type="button"
                onClick={() => goToQuestion(index)}
                className={`h-10 rounded-lg text-sm font-semibold transition-colors ${
                  questionButton.isCurrent
                    ? "bg-primary text-white"
                    : questionButton.isAnswered
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {questionButton.number}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:overflow-y-auto">
          <div className="mb-6">
            <span className="inline-block rounded bg-gray-200 px-3 py-1 text-xs font-semibold uppercase text-gray-700">
              {currentQuestion?.type.replace("-", " ")}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              {currentQuestion?.title}
            </h2>
          </div>

          <div className="flex-1 space-y-3">
            {currentQuestion?.options.map((option, optionIndex) => {
              const isSelected = answers[currentQuestionIndex] === optionIndex;

              return (
                <button
                  key={`${currentQuestionIndex}-${option.text}-${optionIndex}`}
                  type="button"
                  onClick={() => selectAnswer(optionIndex)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-violet-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {optionLabels[optionIndex] ?? optionIndex + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 sm:text-base">
                      {option.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() =>
                setAnswers((currentAnswers) => {
                  const nextAnswers = { ...currentAnswers };
                  delete nextAnswers[currentQuestionIndex];
                  return nextAnswers;
                })
              }
              className="font-medium text-gray-600 hover:text-gray-900"
            >
              Clear Selection
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentQuestionIndex === questions.length - 1) {
                    finishExam("submitted");
                    return;
                  }

                  goToQuestion(currentQuestionIndex + 1);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-medium text-white hover:bg-violet-700"
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish" : "Save & Next"}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
