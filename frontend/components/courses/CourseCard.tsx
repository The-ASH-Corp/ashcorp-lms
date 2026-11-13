import { Star } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/lib/redux/features/course/courseSlice";
import AdaptiveCourseThumbnail from "./AdaptiveCourseThumbnail";

interface CourseCardCourse extends Omit<Course, "offerPrice" | "rating"> {
  offerPrice?: string | number;
  rating?: number;
  reviews?: string;
  enrolledText?: string;
  badge?: string;
  badgeColor?: string;
}

interface CourseCardProps {
  course: CourseCardCourse;
}

export default function CourseCard({ course }: CourseCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const fillPercentage = Math.max(
        0,
        Math.min(100, Math.round((rating - i) * 100)),
      );

      return (
        <span key={i} className="relative inline-block size-3.5 shrink-0">
          {/* Background empty star */}
          <Star size={14} className="text-gray-300" />

          {/* Foreground star filled with exact point data */}
          {fillPercentage > 0 && (
            <span
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                size={14}
                className="fill-primary text-primary shrink-0 min-w-[14px]"
              />
            </span>
          )}
        </span>
      );
    });
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Adaptive Image Container */}
      <AdaptiveCourseThumbnail
        src={course.imageUrl}
        alt={course.title}
        badge={course.badge}
        badgeColor={course.badgeColor}
      />

      {/* Content */}
      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 min-h-12 sm:min-h-14">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          Instructor: {course.instructor}
        </p>

        {/* Rating */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 sm:mb-4">
          <div className="flex gap-0.5">{renderStars(course.rating ?? 0)}</div>
          <span className="text-xs font-semibold text-gray-800">
            {Number(course.rating ?? 0).toFixed(1)}
          </span>
          <span className="text-xs text-gray-600">
            ({course.reviews ?? "0 Reviews"})
          </span>
          {course.enrolledText && (
            <>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs font-medium text-gray-600">
                {course.enrolledText}
              </span>
            </>
          )}
        </div>

        {/* Price and Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto pt-3 sm:pt-4 border-t border-gray-100">
          <div>
            {course.offerPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-primary">
                  ₹{course.offerPrice}
                </span>
                <span className="text-sm sm:text-base line-through  text-gray-500">
                  ₹{course.price?.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-base sm:text-lg font-bold text-primary">
                ₹{course.price?.toFixed(2)}
              </span>
            )}
          </div>

          <Link
            href={`/course-details/${course.id}`}
            className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors font-medium text-xs sm:text-sm whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
