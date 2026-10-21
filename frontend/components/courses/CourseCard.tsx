import { Star } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/lib/redux/features/course/courseSlice";
import AdaptiveCourseThumbnail from "./AdaptiveCourseThumbnail";

interface CourseCardCourse extends Omit<Course, "offerPrice" | "rating"> {
  offerPrice?: string | number;
  rating?: number;
  reviews?: string;
  badge?: string;
  badgeColor?: string;
}

interface CourseCardProps {
  course: CourseCardCourse;
}

export default function CourseCard({ course }: CourseCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.floor(rating)
            ? "fill-primary text-primary"
            : "text-gray-300"
        }
      />
    ));
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
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="flex gap-0.5">{renderStars(course.rating ?? 0)}</div>
          <span className="text-xs text-gray-600">
            ({course.reviews ?? "0 Reviews"})
          </span>
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
