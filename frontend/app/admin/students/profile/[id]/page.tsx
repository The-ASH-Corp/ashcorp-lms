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

export default function StudentProfilePage() {
  const params = useParams<{ id: string }>();
  const studentId = typeof params?.id === 'string' ? params.id : '';

  const { data: student, isLoading: isStudentLoading, isError: isStudentError } = useGetStudentByIdQuery(studentId, {
    skip: !studentId,
  });
  const { data: courses = [], isLoading: isCoursesLoading } = useGetMyCoursesQuery(studentId, {
    skip: !studentId,
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
      </div>
    </div>
  );
}
