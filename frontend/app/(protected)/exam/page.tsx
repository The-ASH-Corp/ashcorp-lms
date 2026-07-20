"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Lock,
  PlayCircle,
  Search,
} from "lucide-react";
import { PropagateLoader } from "react-spinners";
import { useGetExamsForCoursesQuery } from "@/lib/redux/features/exam/examApi";
import { useGetMyCoursesQuery } from "@/lib/redux/features/student/studentApi";
import { useAppSelector } from "@/lib/redux/hooks";

function stripHtml(value?: string) {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getImageUrl(imageUrl: string | undefined) {
  if (!imageUrl) return "";

  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
  const path = imageUrl.replace(/\\/g, "/").replace(/^\/+/, "");

  return baseUrl ? `${baseUrl}/${path}` : `/${path}`;
}

export default function ExamListPage() {
  const user = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const focusedCourseId = searchParams.get("courseId") ?? "";
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: myCourses = [],
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useGetMyCoursesQuery(undefined, { skip: !user });

  const courseIds = useMemo(
    () => myCourses.map((course) => course.id).filter(Boolean),
    [myCourses],
  );

  const {
    data: courseExams = [],
    isLoading: isExamsLoading,
    isError: isExamsError,
  } = useGetExamsForCoursesQuery(courseIds, {
    skip: !user || courseIds.length === 0,
  });

  const examByCourseId = useMemo(() => {
    return new Map(
      courseExams.map((courseExam) => [courseExam.courseId, courseExam.exams[0]]),
    );
  }, [courseExams]);

  const examCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return myCourses
      .map((course) => {
        const exam = examByCourseId.get(course.id);
        const progress = Math.min(100, Math.max(0, Math.round(course.progress ?? 0)));
        const isUnlocked = progress >= 100;

        return {
          course,
          exam,
          progress,
          isUnlocked,
          isFocused: focusedCourseId === course.id,
        };
      })
      .filter(({ course, exam }) => {
        if (!query) return true;

        const searchableText = [
          course.title,
          course.instructor,
          course.category,
          stripHtml(course.description),
          exam?.title,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .sort((firstCard, secondCard) => {
        if (firstCard.isFocused) return -1;
        if (secondCard.isFocused) return 1;
        return firstCard.course.title.localeCompare(secondCard.course.title);
      });
  }, [examByCourseId, focusedCourseId, myCourses, searchQuery]);

  const isLoading = isCoursesLoading || isExamsLoading;
  const isError = isCoursesError || isExamsError;
  const totalExams = myCourses.length;
  const shownExams = examCards.length;

  if (isLoading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 shadow-sm">
          <PropagateLoader color="#7E23FE" loading={true} size={15} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-lg font-semibold text-red-700">
            Failed to load exams
          </p>
          <p className="mt-2 text-sm leading-6 text-red-600">
            We could not fetch your enrolled course exams right now. Please try
            again in a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
            Enrolled course exams
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Exams</h1>
          <p className="mt-2 text-sm text-gray-600">
            You have {totalExams} exam{totalExams === 1 ? "" : "s"} from your
            enrolled courses.
          </p>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search exams"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </section>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-600">
          {shownExams} of {totalExams} exam{totalExams === 1 ? "" : "s"} shown
        </p>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-sm font-medium text-primary hover:text-violet-700"
          >
            Clear search
          </button>
        )}
      </div>

      {examCards.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {examCards.map(({ course, exam, progress, isUnlocked, isFocused }) => {
            const imageSrc = getImageUrl(course.imageUrl);
            const questionCount = exam?.questions?.length ?? 0;

            return (
              <article
                key={course.id}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-lg ${
                  isFocused ? "border-primary ring-2 ring-violet-100" : "border-gray-200"
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-violet-100 to-gray-200">
                      <BookOpenCheck className="text-primary" size={40} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    {course.category}
                  </span>

                  <span
                    className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      isUnlocked
                        ? "bg-green-600 text-white"
                        : "bg-white/90 text-gray-800"
                    }`}
                  >
                    {isUnlocked ? <CheckCircle2 size={14} /> : <Lock size={14} />}
                    {isUnlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                    {course.title}
                  </p>
                  <h2 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900">
                    {exam?.title ?? `${course.title} Exam`}
                  </h2>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Questions
                      </p>
                      <p className="mt-1 font-bold text-gray-900">
                        {questionCount || "Pending"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Duration
                      </p>
                      <p className="mt-1 flex items-center gap-1 font-bold text-gray-900">
                        <Clock3 size={15} />
                        {exam?.duration ? `${exam.duration}m` : "Pending"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        Course progress
                      </span>
                      <span className="font-bold text-primary">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-200 pt-4">
                    {isUnlocked && exam ? (
                      <Link
                        href={`/exam/assessment/${course.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                      >
                        <PlayCircle size={17} />
                        Start Exam
                      </Link>
                    ) : (
                      <Link
                        href={`/play?courseId=${course.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-violet-300 hover:bg-violet-50"
                      >
                        <Lock size={17} />
                        {exam ? "Complete Course To Unlock" : "Exam Coming Soon"}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-primary">
            <BookOpenCheck size={28} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {totalExams === 0 ? "No enrolled exams yet" : "No matching exams"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600">
            {totalExams === 0
              ? "Enroll in a course and its exam will appear here automatically."
              : "Try a different search term or clear the filter to see all exams."}
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
          >
            Browse courses
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
