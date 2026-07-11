import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/lib/redux/features/course/courseSlice";

interface CourseCardProps {
  course: Course & {
    offerPrice?: string;
    rating?: number;
    reviews?: string;
    badge?: string;
    badgeColor?: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  console.log(course.imageUrl)
  const getCategoryImageUrl = (iconUrl: string | undefined) => {
    if (!iconUrl) return "";

    if (/^https?:\/\//i.test(iconUrl)) return iconUrl;

    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";

    const path = iconUrl
      .replace(/\\/g, "/") // <-- replace \ with /
      .replace(/^\/+/, "");

    return `${baseUrl}/${path}`;
  };
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
      {/* Image Container */}
      <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden bg-gray-100 shrink-0">
        <img
          src={getCategoryImageUrl(course.imageUrl)}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {course.badge && (
          <div
            className={`absolute top-2 sm:top-4 left-2 sm:left-4 ${course.badgeColor} text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full`}
          >
            {course.badge}
          </div>
        )}
      </div>

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
              <span className="text-base sm:text-lg font-bold text-primary">
                {course.offerPrice}
              </span>
            ) : (
              <span className="text-base sm:text-lg font-bold text-primary">
                ${course.price?.toFixed(2)}
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
