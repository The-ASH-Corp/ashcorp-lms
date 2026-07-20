import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Examlocked({ courseId }: { courseId: string }) {
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
    )
}