import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NoQuestionPaper(){
    return(
        <div className="flex min-h-[calc(100vh-170px)] items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto text-primary" size={36} />
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            No exam found
          </h1>
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
    )
}