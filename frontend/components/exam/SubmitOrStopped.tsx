import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface ResultProps {
  displayResult: any;
  status: any;
  answeredCount: any;
  questions: any;
  totalMarks: any;
  selectedExam: any;
  retryExam: () => void;
  courseId: any;
}
export default function SubmitOrStopped({
  displayResult,
  status,
  answeredCount,
  questions,
  totalMarks,
  selectedExam,
  retryExam,
  courseId,
}: ResultProps) {
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
