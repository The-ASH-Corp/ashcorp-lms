'use client';

import { useState } from 'react';
import { Grid3x3, List } from 'lucide-react';
import UserCourseList from '@/components/courses/UserCourseList';
import StatCard from '@/components/courses/StatCard';
import { useGetMyCoursesQuery } from '@/lib/redux/features/student/studentApi';
import { PropagateLoader } from 'react-spinners';

type ViewType = 'grid' | 'list';

type Course = {
  id: string;
  title: string;
  instructor: string;
  category: string;
  image: string;
  progress: number;
  status: 'in-progress' | 'completed';
  hasCheckmark: boolean;
};

export default function MyCourses() {
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const { data: enrolledCourses = [], isLoading, isError } = useGetMyCoursesQuery();
  const courses: Course[] = enrolledCourses.map((course) => {
    const progress = Math.min(100, Math.max(0, Math.round(course.progress ?? 0)));

    return {
      id: course.id ?? course._id ?? "",
      title: course.title,
      instructor: course.instructor,
      category: course.category,
      image: course.imageUrl,
      progress,
      status: progress >= 100 ? "completed" : "in-progress",
      hasCheckmark: progress >= 100,
    };
  });
  const filteredCourses = courses.filter((course) => {
    if (activeTab === "all") return true;
    return course.status === activeTab;
  });
  const activeCourses = courses.filter((course) => course.status === "in-progress").length;
  const completedCourses = courses.filter((course) => course.status === "completed").length;
  const averageProgress = courses.length
    ? Math.round(courses.reduce((total, course) => total + course.progress, 0) / courses.length)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <StatCard
            label="ACTIVE COURSES"
            number={String(activeCourses).padStart(2, "0")}
            description="Enrolled"
            detail={`${courses.length} total enrolled courses`}
          />
          <StatCard
            label="COMPLETED"
            number={String(completedCourses).padStart(2, "0")}
            description="Total"
            detail={`${averageProgress}% average video progress`}
          />
          <StatCard
            label="VIDEO PROGRESS"
            number={String(averageProgress)}
            unit="%"
            description="Average"
            detail="Based on watched video time"
          />
        </div>

        {/* Course Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeTab === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeTab === 'in-progress'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeTab === 'completed'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewType === 'grid'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewType === 'list'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Course Cards */}
        {isLoading && (
          <div className="flex min-h-64 items-center justify-center">
            <PropagateLoader color="#7E23FE" loading={true} size={15} />
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
            Failed to load your enrolled courses.
          </div>
        )}

        {!isLoading && !isError && filteredCourses.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No courses found</h3>
            <p className="mt-2 text-sm text-gray-600">
              Enrolled courses will appear here after you join a course.
            </p>
          </div>
        )}

        <div className={`${viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'} mb-16`}>
          {filteredCourses.map(course => (
            <UserCourseList key={course.id} course={course} viewType={viewType} />
          ))}
        </div>
      </div>
    </div>
  );
}
