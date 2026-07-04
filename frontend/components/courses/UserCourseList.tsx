import { ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    instructor: string;
    category: string;
    image: string;
    progress: number;
    status: 'in-progress' | 'completed';
    hasCheckmark: boolean;
  };
  viewType: 'grid' | 'list';
}

export default function UserCourseList({ course, viewType }: CourseCardProps) {
  const getProgressColor = () => {
    if (course.status === 'completed') return 'bg-green-500';
    return 'bg-violet-600';
  };

  if (viewType === 'list') {
    return (
      <div className="flex flex-col sm:flex-row gap-4 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
        <div className="w-full sm:w-32 h-32 sm:h-32 rounded-lg overflow-hidden shrink-0">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{course.category}</p>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-4">👤 {course.instructor}</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${getProgressColor()}`} style={{ width: `${course.progress}%` }}></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">{course.progress}%</span>
          </div>
          <button className="text-violet-600 font-semibold text-sm hover:text-violet-700 flex items-center gap-2">
            Resume Lesson <ArrowRight size={16} />
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 sm:flex-col">
          {course.hasCheckmark && (
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
              ✓
            </div>
          )}
          {course.status === 'completed' && (
            <button className="px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors">
              Review
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-gray-900 bg-opacity-80 text-white text-xs font-bold rounded">
            {course.category}
          </span>
        </div>
        {course.hasCheckmark && (
          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
            ✓
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
          👤 {course.instructor}
        </p>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-6 mt-auto">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getProgressColor()}`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 w-10 text-right">
            {course.status === "completed" ? "Done" : `${course.progress}%`}
          </span>
        </div>

        {/* Status Text */}
        {course.status === "completed" && (
          <p className="text-sm font-semibold text-green-600 mb-4">Completed</p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {course.status !== "completed" && (
            <button className="flex-1 text-violet-600 font-semibold text-sm hover:text-violet-700 flex items-center justify-center gap-2 py-2">
              Resume Lesson <ArrowRight size={16} />
            </button>
          )}

          {course.status === "completed" && (
            <Link
              href={`/certificate/${course.id}`}
              className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors text-sm"
            >
              Review
            </Link>
          )}
          {course.status === "completed" && (
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Lock size={18} className="text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
