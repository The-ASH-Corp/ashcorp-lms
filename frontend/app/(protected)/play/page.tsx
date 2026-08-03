'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Play, CheckCircle2} from 'lucide-react';
import { useAddReviewMutation, useGetCourseQuery } from '@/lib/redux/features/course/courseApi';
import { useGetChaptersByCourseIdQuery } from '@/lib/redux/features/chapter/chapterApi';
import { useGetMyCoursesQuery, useUpdateCourseProgressMutation } from '@/lib/redux/features/student/studentApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { Star } from "lucide-react";
import { toast } from 'sonner';

const formatDuration = (duration?: number) => {
  if (!duration || duration <= 0) return "Video";

  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export default function PlayPage() {
  const [currentTab, setCurrentTab] = useState('overview');
  const authUser = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? "";
  const { data: course } = useGetCourseQuery(courseId, { skip: !courseId });
  const { data: chapters = [], isLoading: isChaptersLoading } = useGetChaptersByCourseIdQuery(courseId, { skip: !courseId });
  const { data: myCourses = [] } = useGetMyCoursesQuery();
  const [updateCourseProgress] = useUpdateCourseProgressMutation();
  const [courseProgress, setCourseProgress] = useState(0);
  const [currentVideoProgress, setCurrentVideoProgress] = useState(0);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const lastSyncedProgress = useRef(0);
  const enrolledCourseProgress = myCourses.find((item) => item.id === courseId)?.progress ?? 0;
  

  const sortedChapters = useMemo(
    () => [...chapters].sort((firstChapter, secondChapter) => (firstChapter.serialNumber ?? 0) - (secondChapter.serialNumber ?? 0)),
    [chapters],
  );

  const lessons = useMemo(
    () => sortedChapters.flatMap((chapter) => {
      const sortedContents = [...(chapter.contents ?? [])].sort(
        (firstContent, secondContent) => (firstContent.sequance ?? 0) - (secondContent.sequance ?? 0),
      );

      return sortedContents.map((lesson) => ({
        ...lesson,
        id: `${chapter._id}-${lesson.sequance}`,
        chapterId: chapter._id,
        chapterTitle: chapter.title,
        chapterSerialNumber: chapter.serialNumber,
      }));
    }),
    [sortedChapters],
  );

  const lessonCount = lessons.length;
  const completedLessons = lessonCount > 0 ? Math.floor((courseProgress / 100) * lessonCount) : 0;

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? null;
  const selectedLessonPosition = selectedLesson ? lessons.findIndex((lesson) => lesson.id === selectedLesson.id) + 1 : 0;
  const activeVideoUrl = selectedLesson?.contentUrl || course?.videoUrl;


  useEffect(() => {
    const normalizedProgress = Math.min(100, Math.max(0, Math.round(enrolledCourseProgress)));

    setCourseProgress(normalizedProgress);
    lastSyncedProgress.current = normalizedProgress;
  }, [enrolledCourseProgress]);

  useEffect(() => {
    if (selectedLessonId || sortedChapters.length === 0) return;

    if (lessons[0]) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons, selectedLessonId]);

  useEffect(() => {
    setCurrentVideoProgress(0);
  }, [selectedLessonId]);

  useEffect(() => {
    if (courseId && course) {
      try {
        const lastPlayedData = {
          courseId,
          courseTitle: course.title,
          chapterTitle: selectedLesson?.chapterTitle || course.title,
          lessonTitle: selectedLesson?.contentTitle || "Lesson",
          lessonId: selectedLessonId,
          imageUrl: course.imageUrl,
          progress: courseProgress,
          updatedAt: new Date().toISOString(),
        };
        window.localStorage.setItem("ashcorp_last_played", JSON.stringify(lastPlayedData));
      } catch {
        // ignore localStorage errors
      }
    }
  }, [courseId, course, selectedLesson, selectedLessonId, courseProgress]);

  const handleVideoProgress = async (event: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!courseId) return;

    const video = event.currentTarget;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    const watchedVideoProgress = Math.min(
      100,
      Math.max(0, Math.round((video.currentTime / video.duration) * 100)),
    );
    const watchedCourseProgress = lessonCount > 0 && selectedLessonPosition > 0
      ? Math.min(
          100,
          Math.round(((selectedLessonPosition - 1 + watchedVideoProgress / 100) / lessonCount) * 100),
        )
      : watchedVideoProgress;

    setCurrentVideoProgress(watchedVideoProgress);
    setCourseProgress((currentProgress) => Math.max(currentProgress, watchedCourseProgress));

    if (
      watchedCourseProgress === 100 ||
      watchedCourseProgress - lastSyncedProgress.current >= 5
    ) {
      lastSyncedProgress.current = watchedCourseProgress;
      try {
        await updateCourseProgress({ courseId, progress: watchedCourseProgress }).unwrap();
      } catch {
        return;
      }
    }
  };

  const [addReview, { isLoading }] = useAddReviewMutation();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const userId = authUser?.id != null ? String(authUser.id) : "";
  const hasReviewedCourse = Boolean(
    userId && course?.rating?.some((entry) => String(entry.userId) === userId),
  );

  const handleSubmitReview = async () => {
    if (!courseId) return;

    if (hasReviewedCourse) {
      toast.info("You have already reviewed this course");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      await addReview({
        courseId,
        rating,
        review,
      }).unwrap();

      toast.success("Review submitted successfully!");

      // Reset form
      setRating(0);
      setHoverRating(0);
      setReview("");
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: unknown } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : "Something went wrong";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Content - Video and Details */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="relative bg-gray-950 rounded-xl overflow-hidden mb-6 aspect-video">
              {activeVideoUrl ? (
                <video
                  key={activeVideoUrl}
                  src={activeVideoUrl}
                  controls
                  className="h-full w-full"
                  onTimeUpdate={handleVideoProgress}
                  onEnded={handleVideoProgress}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-violet-700 transition-colors">
                    <Play size={32} className="text-white fill-white ml-1" />
                  </button>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-200">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${currentVideoProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
              {["overview"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`pb-3 px-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                    currentTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Lesson Title and Info */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {selectedLesson?.contentTitle ??
                  course?.title ??
                  "Course Lesson"}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-200 rounded-full"></div>
                  <span className="font-medium text-gray-900">
                    {course?.instructor ?? "Instructor"}
                  </span>
                </div>
                <span className="text-sm">•</span>
                <span className="text-gray-600">
                  {course?.category ?? "Course"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}

            {/* Lesson Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Lesson Description
              </h2>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: course?.description || "",
                }}
              />
              {/* <p className="text-gray-600 leading-relaxed mb-6">
                {course?.description ??
                  "Start playing the course video to update your learning progress."}
              </p> */}
            </div>
          </div>

          {/* Right Sidebar - Progress */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Course Progress Card */}
            <div className="bg-linear-to-br from-violet-50 to-gray-50 rounded-xl p-6 border border-violet-200 mb-6 ">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Course Progress
                </h3>
                <span className="text-2xl font-bold text-primary">
                  {courseProgress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${courseProgress}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                {completedLessons} of {lessonCount} lessons completed
              </p>

              {/* Lessons List */}
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {isChaptersLoading ? (
                  <div className="rounded-lg bg-white/70 p-3 text-sm text-gray-500">
                    Loading chapters...
                  </div>
                ) : lessonCount === 0 ? (
                  <div className="rounded-lg bg-white/70 p-3 text-sm text-gray-500">
                    No chapter videos added for this course.
                  </div>
                ) : (
                  sortedChapters.map((chapter) => {
                    const chapterLessons = lessons.filter(
                      (lesson) => lesson.chapterId === chapter._id,
                    );

                    if (chapterLessons.length === 0) return null;

                    return (
                      <div key={chapter._id} className="mb-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                          {chapter.serialNumber}. {chapter.title}
                        </h4>
                        <div className="space-y-2 ml-2">
                          {chapterLessons.map((lesson) => {
                            const lessonPosition =
                              lessons.findIndex(
                                (item) => item.id === lesson.id,
                              ) + 1;
                            const isPlaying = lesson.id === selectedLessonId;
                            const isCompleted =
                              lessonPosition <= completedLessons;

                            return (
                              <button
                                type="button"
                                key={lesson.id}
                                onClick={() => setSelectedLessonId(lesson.id)}
                                className={`flex w-full items-start gap-2 rounded p-2 text-left transition-colors ${
                                  isPlaying
                                    ? "bg-violet-100 border border-violet-300"
                                    : "hover:bg-white"
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2
                                    size={18}
                                    className="text-primary shrink-0 mt-0.5"
                                  />
                                ) : isPlaying ? (
                                  <Play
                                    size={18}
                                    className="text-primary shrink-0 mt-0.5"
                                  />
                                ) : (
                                  <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                                )}
                                <div className="min-w-0">
                                  <p
                                    className={`text-sm font-medium ${isPlaying ? "text-primary" : "text-gray-900"}`}
                                  >
                                    {chapter.serialNumber}.{lesson.sequance}{" "}
                                    {lesson.contentTitle}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatDuration(lesson.duration)}
                                  </p>
                                  {isPlaying && (
                                    <p className="text-xs text-primary font-medium">
                                      Playing
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Exam Button */}
              {courseProgress >= 100 ? (
                <Link
                  href={`/exam/assessment/${courseId}`}
                  className="block w-full mt-6 bg-primary text-center text-white font-medium py-3 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Go To Exam
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full mt-6 bg-gray-200 text-gray-500 font-medium py-3 rounded-lg cursor-not-allowed"
                >
                  Complete Course To Unlock Exam
                </button>
              )}
            </div>
            <div className="bg-linear-to-br from-violet-50 to-gray-50 rounded-xl p-6 border border-violet-200">
              {hasReviewedCourse ? (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Review Submitted
                  </h3>
                  <p className="text-sm text-gray-600">
                    You have already reviewed this course. One review per course is allowed.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Leave a Review
                  </h3>

                  {/* Rating */}
                  <div className="mb-5">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </p>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Star
                            size={28}
                            className={`transition-colors ${
                              star <= (hoverRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>

                    <textarea
                      rows={5}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your learning experience..."
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleSubmitReview}
                    className="w-full rounded-lg bg-primary py-3 text-white font-medium hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
