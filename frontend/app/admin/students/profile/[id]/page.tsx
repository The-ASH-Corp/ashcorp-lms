'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, BookOpen, CheckCircle, Clock, Edit, Mail, Phone, TrendingUp } from 'lucide-react';
import { PropagateLoader } from 'react-spinners';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmActionDialog } from '@/components/shared/confirm-action-dialog';
import { toast } from 'sonner';
import { useBlockStudentMutation, useGetMyCoursesQuery, useGetStudentByIdQuery, type EnrolledCourse, type Student } from '@/lib/redux/features/student/studentApi';
import { CourseProgressRow } from '@/components/admin/student/course-progress-row';
import { useGetExamsForCoursesQuery, type Exam } from '@/lib/redux/features/exam/examApi';

const getInitials = (name?: string) => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'S';
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getCourseId = (course: EnrolledCourse) => course.id || (course as { _id?: string })._id || '';

const clampProgress = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

const getCourseProgress = (student: Student | undefined, course: EnrolledCourse) => {
  const courseId = getCourseId(course);
  const studentProgress = student?.courseProgress?.[courseId];
  return clampProgress(Number(studentProgress ?? course.progress ?? 0));
};

const isExamPassedForCourse = (student: Student | undefined, courseId: string) =>
  Boolean(
    student?.examAttempts?.some(
      (attempt) => String(attempt.courseId) === String(courseId) && attempt.isPassed === true,
    ),
  );

const isCertificateUploadedForCourse = (student: Student | undefined, courseId: string) =>
  Boolean(
    student?.certificates?.some((certificate) => {
      if (typeof certificate === 'string') {
        return certificate === courseId;
      }

      return certificate?.courseId === courseId && Boolean(certificate?.link);
    }),
  );

const getStatusBadgeClasses = (status?: string) => {
  if (status === 'submitted') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  return 'bg-amber-50 text-amber-700 border-amber-200';
};

const getPassBadgeClasses = (isPassed?: boolean) =>
  isPassed
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-red-50 text-red-700 border-red-200';

export default function StudentProfilePage() {
  const params = useParams<{ id: string }>();
  const studentId = typeof params?.id === 'string' ? params.id : '';

  const { data: student, isLoading: isStudentLoading, isError: isStudentError } = useGetStudentByIdQuery(studentId, {
    skip: !studentId,
  });
  const { data: courses = [], isLoading: isCoursesLoading } = useGetMyCoursesQuery(studentId, {
    skip: !studentId,
  });
  const courseIds = useMemo(
    () => Array.from(new Set(courses.map((course) => getCourseId(course)).filter(Boolean))),
    [courses],
  );
  const { data: courseExamBundles = [], isLoading: isExamsLoading } = useGetExamsForCoursesQuery(courseIds, {
    skip: courseIds.length === 0,
  });
  const [blockStudent, { isLoading: isBlockUpdating }] = useBlockStudentMutation();

  const handleBlockToggle = async () => {
    if (!studentId) {
      toast.error('Invalid student id');
      return;
    }

    try {
      const updatedStudent = await blockStudent(studentId).unwrap();
      toast.success(
        updatedStudent.status === 'Inactive'
          ? 'Student blocked successfully'
          : 'Student unblocked successfully',
      );
    } catch (error: unknown) {
      const message =
        typeof error === 'object' && error !== null && 'data' in error &&
        typeof (error as { data?: { message?: string } }).data?.message === 'string'
          ? (error as { data?: { message?: string } }).data?.message
          : 'Failed to update student status';
      toast.error(message);
    }
  };

  const progressSummary = useMemo(() => {
    if (courses.length === 0) {
      return {
        averageProgress: 0,
        completedCourses: 0,
      };
    }

    const progresses = courses.map((course) => getCourseProgress(student, course));
    const totalProgress = progresses.reduce((total, value) => total + value, 0);
    const completedCourses = progresses.filter((value) => value >= 100).length;

    return {
      averageProgress: clampProgress(totalProgress / progresses.length),
      completedCourses,
    };
  }, [courses, student]);

  const examsById = useMemo(() => {
    const map = new Map<string, Exam>();

    courseExamBundles.forEach((bundle) => {
      bundle.exams.forEach((exam) => {
        const examId = exam.id || exam._id;
        if (examId) {
          map.set(String(examId), exam);
        }
      });
    });

    return map;
  }, [courseExamBundles]);

  const examAttemptsByCourse = useMemo(() => {
    const attempts = student?.examAttempts ?? [];
    const grouped = new Map<string, typeof attempts>();

    attempts.forEach((attempt) => {
      const courseId = String(attempt.courseId ?? '');
      if (!courseId) {
        return;
      }

      const current = grouped.get(courseId) ?? [];
      current.push(attempt);
      grouped.set(courseId, current);
    });

    return grouped;
  }, [student]);

  if (isStudentLoading || isCoursesLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <PropagateLoader color="#7E23FE" loading size={12} />
      </div>
    );
  }

  if (isStudentError || !student) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-lg font-semibold text-gray-700">Unable to load student profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-700 sm:h-24 sm:w-24">
              {getInitials(student.name)}
            </div>
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{student.name}</h1>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <p>ID: {student._id}</p>
                <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${student.status === 'Inactive' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  <span className={`h-2 w-2 rounded-full ${student.status === 'Inactive' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  {student.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href={`/admin/students/edit/${student._id}`}>
                <Edit size={16} />
                Edit Profile
              </Link>
            </Button>
            <ConfirmActionDialog
              title={student.status === 'Inactive' ? 'Unblock Student' : 'Block Student'}
              description={
                student.status === 'Inactive'
                  ? `This will unblock ${student.name} and restore account access.`
                  : `This will block ${student.name} and temporarily revoke account access.`
              }
              confirmLabel={student.status === 'Inactive' ? 'Unblock' : 'Block'}
              loading={isBlockUpdating}
              loadingLabel={student.status === 'Inactive' ? 'Unblocking...' : 'Blocking...'}
              onConfirm={handleBlockToggle}
              trigger={
                <Button className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700">
                  <AlertCircle size={16} />
                  {student.status === 'Inactive' ? 'Unblock' : 'Suspend'}
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 p-6">
            <div className="mb-3 flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Total Courses</p>
              <BookOpen size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
          </Card>

          <Card className="border-gray-200 p-6">
            <div className="mb-3 flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Completed</p>
              <CheckCircle size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{progressSummary.completedCourses}</p>
          </Card>

          <Card className="border-gray-200 p-6">
            <div className="mb-3 flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Avg. Progress</p>
              <TrendingUp size={20} className="text-primary" />
            </div>
            <p className="mb-2 text-3xl font-bold text-gray-900">{progressSummary.averageProgress}%</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full bg-primary" style={{ width: `${progressSummary.averageProgress}%` }} />
            </div>
          </Card>

          <Card className="border-gray-200 p-6">
            <div className="mb-3 flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Last Update</p>
              <Clock size={20} className="text-primary" />
            </div>
            <p className="text-base font-bold text-gray-900">{formatDate(student.updatedAt)}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="border-gray-200 p-6">
              <h2 className="mb-6 text-lg font-bold text-gray-900">Profile Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-sm font-medium text-primary">Email Address</p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail size={14} /> {student.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-primary">Phone Number</p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone size={14} /> {student.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-primary">Role</p>
                  <p className="text-sm text-gray-700">{student.role || 'user'}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-primary">Joined Date</p>
                  <p className="text-sm text-gray-700">{formatDate(student.createdAt)}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-gray-200 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Enrolled Courses</h2>
                <span className="text-sm font-medium text-primary">{courses.length} Total</span>
              </div>

              {courses.length === 0 ? (
                <p className="text-sm text-gray-500">No enrolled courses found for this student.</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <CourseProgressRow
                      key={getCourseId(course)}
                      course={course}
                      progress={getCourseProgress(student, course)}
                      isExamPassed={isExamPassedForCourse(student, getCourseId(course))}
                      isCertificateUploaded={isCertificateUploadedForCourse(student, getCourseId(course))}
                      certificateUploadPath={`/admin/certificate/list/${student._id}`}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <Card className="mt-6 overflow-hidden border-violet-100 bg-linear-to-b from-violet-50/40 to-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-violet-100 pb-4">
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Exam Attend Details</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {student.examAttempts?.length ?? 0} Total Attempts
            </span>
          </div>

          {isExamsLoading ? (
            <p className="text-sm text-gray-500">Loading exam details...</p>
          ) : courseIds.length === 0 ? (
            <p className="text-sm text-gray-500">No enrolled courses found for this student.</p>
          ) : (
            <div className="space-y-5">
              {courses.map((course) => {
                const courseId = getCourseId(course);
                const attempts = (examAttemptsByCourse.get(courseId) ?? [])
                  .slice()
                  .sort(
                    (first, second) =>
                      new Date(second.attemptedAt ?? '').getTime() -
                      new Date(first.attemptedAt ?? '').getTime(),
                  );
                const passedAttempts = attempts.filter((attempt) => attempt.isPassed).length;

                return (
                  <div
                    key={`exam-attempts-${courseId}`}
                    className="rounded-2xl border border-violet-100 bg-white p-5 shadow-[0_8px_30px_rgba(124,58,237,0.08)]"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-extrabold text-gray-900 sm:text-lg">{course.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 font-semibold text-violet-700">
                          Attempts: {attempts.length}
                        </span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                          Passed: {passedAttempts}
                        </span>
                      </div>
                    </div>

                    {attempts.length === 0 ? (
                      <p className="mt-3 text-xs text-gray-500">No exam attempts recorded for this course.</p>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {attempts.map((attempt, attemptIndex) => {
                          const exam = examsById.get(String(attempt.examId ?? ''));

                          return (
                            <details
                              key={`${courseId}-${attempt.examId}-${attemptIndex}`}
                              className="group rounded-xl border border-gray-200 bg-linear-to-b from-white to-gray-50 px-4 py-3 transition-colors open:border-violet-200"
                            >
                              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="text-sm font-bold text-gray-900 sm:text-base">
                                      Attempt {attempts.length - attemptIndex}
                                      {exam?.title ? ` · ${exam.title}` : ''}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatDateTime(attempt.attemptedAt)}
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className={`rounded-full border px-3 py-1 font-semibold ${getStatusBadgeClasses(attempt.status)}`}>
                                      {attempt.status === 'submitted' ? 'Submitted' : 'Stopped'}
                                    </span>
                                    <span className={`rounded-full border px-3 py-1 font-semibold ${getPassBadgeClasses(attempt.isPassed)}`}>
                                      {attempt.isPassed ? 'Passed' : 'Not Passed'}
                                    </span>
                                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 font-semibold text-gray-700">
                                      Score: {attempt.score ?? 0}/{attempt.totalMarks ?? 0}
                                    </span>
                                  </div>
                                </div>
                              </summary>

                              <div className="mt-3 border-t border-gray-200 pt-3">
                                <div className="grid gap-2 rounded-lg bg-white p-3 sm:grid-cols-2">
                                  <p className="text-xs font-semibold text-gray-700">
                                    Pass Mark: <span className="font-bold text-gray-900">{attempt.passMarks ?? 0}</span>
                                  </p>
                                  <p className="text-xs font-semibold text-gray-700">
                                    Reason: <span className="font-medium text-gray-900">{attempt.reason || 'N/A'}</span>
                                  </p>
                                </div>

                                <div className="mt-3 space-y-2">
                                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Selected Options</p>
                                  {!attempt.answers || attempt.answers.length === 0 ? (
                                    <p className="text-xs text-gray-500">No answer records available for this attempt.</p>
                                  ) : (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                      {attempt.answers.map((answer, answerIndex) => {
                                        const question = exam?.questions?.[answer.questionIndex];
                                        const selectedOption = question?.options?.[answer.selectedOptionIndex];

                                        return (
                                          <div
                                            key={`${courseId}-${attemptIndex}-${answerIndex}`}
                                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
                                          >
                                            <p className="text-xs font-bold text-gray-900">
                                              Q{answer.questionIndex + 1}: {question?.title ?? 'Question text unavailable'}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-700">
                                              <span className="font-semibold text-gray-600">Chosen:</span>{' '}
                                              {selectedOption?.text ?? `Option ${answer.selectedOptionIndex + 1}`}
                                            </p>
                                            <p
                                              className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${answer.isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}
                                            >
                                              {answer.isCorrect ? 'Correct' : 'Incorrect'}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </details>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
