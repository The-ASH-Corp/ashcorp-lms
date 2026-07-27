'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Award, Play, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useGetMyCoursesQuery } from '@/lib/redux/features/student/studentApi';
import { useGetCurrentUserQuery } from '@/lib/redux/features/auth/authApi';
import { PropagateLoader } from 'react-spinners';

interface LastPlayedInfo {
  courseId: string;
  courseTitle: string;
  chapterTitle: string;
  lessonTitle: string;
  lessonId?: string;
  imageUrl?: string;
  progress?: number;
  updatedAt?: string;
}

export default function StudentDashboardPage() {
  const { data: enrolledCourses = [], isLoading: isCoursesLoading } = useGetMyCoursesQuery();
  const { data: currentUser, isLoading: isUserLoading } = useGetCurrentUserQuery();

  const [lastPlayed, setLastPlayed] = useState<LastPlayedInfo | null>(null);

  const isLoading = isCoursesLoading || isUserLoading;

  const totalMyCourses = enrolledCourses.length;
  const completedCoursesCount = enrolledCourses.filter(
    (course) => Math.round(course.progress ?? 0) >= 100
  ).length;

  const certificatesCount = currentUser?.certificates?.length ?? 0;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('ashcorp_last_played');
      if (stored) {
        const parsed = JSON.parse(stored) as LastPlayedInfo;
        const matchedEnrolled = enrolledCourses.find(
          (c) => (c.id ?? c._id) === parsed.courseId
        );

        if (matchedEnrolled) {
          setLastPlayed({
            ...parsed,
            imageUrl: parsed.imageUrl || matchedEnrolled.imageUrl,
            progress: matchedEnrolled.progress ?? parsed.progress ?? 0,
          });
          return;
        }
      }
    } catch {
      // ignore localStorage errors
    }

    if (enrolledCourses.length > 0) {
      const activeCourse =
        enrolledCourses.find((c) => (c.progress ?? 0) < 100) || enrolledCourses[0];

      setLastPlayed({
        courseId: activeCourse.id ?? activeCourse._id ?? '',
        courseTitle: activeCourse.title,
        chapterTitle: activeCourse.category || 'Course Module',
        lessonTitle: 'Continue Lesson',
        imageUrl: activeCourse.imageUrl,
        progress: Math.min(100, Math.max(0, Math.round(activeCourse.progress ?? 0))),
      });
    }
  }, [enrolledCourses]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-200 text-sm font-medium mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Student Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {currentUser?.name || 'Student'}! 👋
            </h1>
            <p className="mt-1 text-sm sm:text-base text-violet-100/90 max-w-xl">
              Track your course metrics, review your certificates, and resume your last played chapter.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-xs transition-colors border border-white/20 text-sm shrink-0 self-start sm:self-auto"
          >
            <BookOpen className="h-4 w-4" />
            Explore Courses
          </Link>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Stat 1: My Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                My Courses
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {String(totalMyCourses).padStart(2, '0')}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enrolled learning paths
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-primary dark:bg-violet-950/50 dark:text-violet-400">
              <BookOpen className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-violet-100 dark:bg-violet-950">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${totalMyCourses > 0 ? 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Stat 2: Completed Courses */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Completed Course
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {String(completedCoursesCount).padStart(2, '0')}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Finished with 100% progress
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950">
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{
                width: `${
                  totalMyCourses > 0 ? (completedCoursesCount / totalMyCourses) * 100 : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Stat 3: Certificate Achieved */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Certificate Achieved
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {String(certificatesCount).padStart(2, '0')}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Earned course credentials
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Award className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-amber-100 dark:bg-amber-950">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${certificatesCount > 0 ? 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Section Split into Two Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Last Played Chapter & Resume Navigation */}
        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-primary dark:bg-violet-950/60 dark:text-violet-400">
                <Clock className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Last Played Chapter
              </h2>
            </div>
            {lastPlayed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Recent Activity
              </span>
            )}
          </div>

          {lastPlayed ? (
            <div className="flex flex-1 flex-col justify-between space-y-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Course Image / Video Poster Thumbnail */}
                <div className="relative aspect-video w-full sm:w-44 shrink-0 overflow-hidden rounded-xl bg-gray-900 shadow-xs">
                  {lastPlayed.imageUrl ? (
                    <img
                      src={lastPlayed.imageUrl}
                      alt={lastPlayed.courseTitle}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-indigo-800 text-white">
                      <Play className="h-8 w-8 fill-white/80 opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md backdrop-blur-xs">
                      <Play className="h-5 w-5 fill-primary ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Course & Chapter Info */}
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide dark:text-violet-400">
                    {lastPlayed.chapterTitle || 'Chapter Module'}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                    {lastPlayed.courseTitle}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    Current Lesson: {lastPlayed.lessonTitle}
                  </p>

                  {/* Progress info */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold text-primary dark:text-violet-400">
                        {Math.round(lastPlayed.progress ?? 0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(0, Math.round(lastPlayed.progress ?? 0)))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pick up right where you left off
                </p>
                <Link
                  href={`/play?courseId=${lastPlayed.courseId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Play className="h-4 w-4 fill-white" />
                  Resume Chapter
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-primary dark:bg-violet-950 dark:text-violet-400 mb-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                No Recent Playback
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                Enroll in a course and start watching lessons to track your last played chapter here.
              </p>
              <Link
                href="/courses"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-violet-700 dark:text-violet-400"
              >
                Browse Available Courses
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Blank Area (Reserved for future features) */}
        <div className="flex flex-col rounded-2xl border border-dashed border-gray-200 bg-gray-50/30 p-6 dark:border-gray-800 dark:bg-gray-900/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Section Reserved
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-center min-h-[220px]">
            {/* Blank placeholder area - will add later */}
          </div>
        </div>
      </div>
    </div>
  );
}
