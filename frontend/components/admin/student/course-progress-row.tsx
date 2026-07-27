'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useGetChaptersByCourseIdQuery, type Chapter } from '@/lib/redux/features/chapter/chapterApi';
import type { EnrolledCourse } from '@/lib/redux/features/student/studentApi';

interface ChapterProgressItem {
  id: string;
  title: string;
  progress: number;
}

interface CourseProgressRowProps {
  course: EnrolledCourse;
  progress: number;
  isExamPassed?: boolean;
  isCertificateUploaded?: boolean;
  certificateUploadPath?: string;
}

const getCourseId = (course: EnrolledCourse) => course.id || (course as { _id?: string })._id || '';

const clampProgress = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

const getChapterWatchBreakdown = (chapters: Chapter[], courseProgress: number): ChapterProgressItem[] => {
  if (chapters.length === 0) {
    return [];
  }

  const sorted = [...chapters].sort((first, second) => (first.serialNumber ?? 0) - (second.serialNumber ?? 0));
  const lessonsPerChapter = sorted.map((chapter) => Math.max(1, chapter.contents?.length ?? 0));
  const totalLessons = lessonsPerChapter.reduce((total, lessonCount) => total + lessonCount, 0);
  const watchedLessonUnits = (clampProgress(courseProgress) / 100) * totalLessons;

  let consumedLessons = 0;

  return sorted.map((chapter, index) => {
    const chapterLessons = lessonsPerChapter[index];
    const chapterWatched = Math.max(0, Math.min(chapterLessons, watchedLessonUnits - consumedLessons));
    const chapterProgress = (chapterWatched / chapterLessons) * 100;

    consumedLessons += chapterLessons;

    return {
      id: chapter._id,
      title: chapter.title,
      progress: clampProgress(chapterProgress),
    };
  });
};

export function CourseProgressRow({
  course,
  progress,
  isExamPassed = false,
  isCertificateUploaded = false,
  certificateUploadPath,
}: CourseProgressRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const courseId = getCourseId(course);

  const { data: chapters = [], isFetching: isChaptersLoading } = useGetChaptersByCourseIdQuery(courseId, {
    skip: !isExpanded || !courseId,
  });

  const chapterProgresses = useMemo(
    () => getChapterWatchBreakdown(chapters, progress),
    [chapters, progress],
  );

  const shouldShowCertificateNotice = progress >= 100 && isExamPassed;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <div className="flex items-start gap-4">
        <Image
          src={course.imageUrl || '/images/placeholder-course.png'}
          alt={course.title || 'Course image'}
          className="h-16 w-16 rounded object-cover"
          width={64}
          height={64}
          unoptimized
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">{course.title}</h3>
            <button
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              className="inline-flex items-center gap-1 rounded-md border border-violet-200 px-2.5 py-1 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-50"
            >
              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              Chapters
            </button>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs font-medium text-gray-700">{progress}% Complete</p>
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
          {isChaptersLoading ? (
            <p className="text-xs text-gray-500">Loading chapter progress...</p>
          ) : chapterProgresses.length === 0 ? (
            <p className="text-xs text-gray-500">No chapter data available.</p>
          ) : (
            chapterProgresses.map((chapter) => (
              <div key={chapter.id} className="flex items-center justify-between rounded-md bg-white px-3 py-2">
                <p className="truncate pr-3 text-xs font-medium text-gray-700 sm:text-sm">{chapter.title}</p>
                <p className="text-xs font-semibold text-violet-700">{chapter.progress}% watched</p>
              </div>
            ))
          )}
        </div>
      ) : null}

      {shouldShowCertificateNotice ? (
        <div className={`mt-3 rounded-md border px-3 py-2 text-xs font-medium ${
          isCertificateUploaded
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-amber-200 bg-amber-50 text-amber-700'
        }`}>
          {isCertificateUploaded ? (
            <p>Student passed the exam and certificate is uploaded.</p>
          ) : (
            <p>
              Student passed the exam. Admin needs to upload certificate.
              {certificateUploadPath ? (
                <>
                  {' '}
                  <Link href={certificateUploadPath} className="font-semibold underline underline-offset-2">
                    Upload now
                  </Link>
                </>
              ) : null}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
