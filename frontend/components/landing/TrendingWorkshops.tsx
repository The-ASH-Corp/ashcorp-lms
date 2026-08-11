"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ShoppingCart, Star,SearchX } from "lucide-react";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import { useGetCurrentUserQuery } from "@/lib/redux/features/auth/authApi";
import { useGetHomepageSettingsQuery } from "@/lib/redux/features/page-settings/pageSettingsApi";
import { useAppSelector } from "@/lib/redux/hooks";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 34, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const getCourseImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return "";

  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/")) return imageUrl;

  const baseUrl =
    process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
  const path = imageUrl.replace(/\\/g, "/").replace(/^\/+/, "");

  return baseUrl ? `${baseUrl}/${path}` : `/${path}`;
};

export default function TrendingWorkshops() {
  const authUser = useAppSelector((state) => state.auth.user);

  // Fetch page settings for trending workshops
  const { data: pageSettings } = useGetHomepageSettingsQuery();
  const trendingSettings = pageSettings?.trendingWorkshops;

  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !authUser,
  });

  const {
    data: courseData,
    isLoading,
    isError,
  } = useGetAllCourseQuery();

  // Protects the UI from undefined, null, or an invalid API response.
  const courses = Array.isArray(courseData) ? courseData : [];
  const user = currentUser ?? authUser;

  const sortedAllCourses = [...courses]
    .map((course) => ({
      ...course,
      enrollmentCount: Number(course.enrolledStudents?.length ?? 0),
    }))
    .sort((a, b) => {
      if (b.enrollmentCount !== a.enrollmentCount) {
        return b.enrollmentCount - a.enrollmentCount;
      }

      if (Boolean(b.isPublished) !== Boolean(a.isPublished)) {
        return b.isPublished ? 1 : -1;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const mostPurchased = sortedAllCourses.filter(
    (course) => course.enrollmentCount > 0,
  );

  const displayedCourses =
    mostPurchased.length >= 3
      ? mostPurchased.slice(0, 3)
      : [
          ...mostPurchased,
          ...sortedAllCourses
            .filter(
              (course) =>
                !mostPurchased.some(
                  (purchasedCourse) => purchasedCourse.id === course.id,
                ),
            )
            .slice(0, 3 - mostPurchased.length),
        ];

  const isPurchased = (courseId: string) =>
    Boolean(
      user?.purchasedCourses?.some(
        (purchasedCourse) =>
          String(purchasedCourse.courseId) === String(courseId),
      ),
    );

  return (
    <section className="bg-linear-to-b from-purple-50/40 to-white py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-950">
            {trendingSettings?.title || "Trending Courses"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {trendingSettings?.description || "The most purchased courses right now."}
          </p>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-sm text-gray-500">
            Loading trending courses...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <h3 className="text-lg font-semibold text-red-700">
              Unable to load trending courses
            </h3>
            <p className="mt-2 text-sm text-red-600">
              Please try again in a moment.
            </p>
          </div>
        ) : courses.length === 0 ? (
  <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
      <SearchX className="h-8 w-8 text-primary" />
    </div>

    <h3 className="text-lg font-semibold text-gray-900">
      No trending courses available
    </h3>

    <p className="mt-2 text-sm text-gray-500">
      Check back soon for newly added courses.
    </p>
  </div>
) : (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.22 }}
          >
            {displayedCourses.map((course) => {
              const averageRating = course.rating?.length
                ? course.rating.reduce((sum, item) => sum + item.rating, 0) /
                  course.rating.length
                : 0;

              const courseImage = getCourseImageUrl(course.imageUrl);
              const purchased = isPurchased(course.id);

              return (
                <motion.div
                  key={course.id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-purple-50 bg-white shadow-xs transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <Image
                      src={courseImage || "/images/course-placeholder.png"}
                      alt={course.title || "Course image"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-indigo-950 px-3 py-1 text-xs font-semibold text-white">
                      Most Purchased
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-semibold uppercase tracking-wider text-primary">
                        {course.category || "Uncategorized"}
                      </span>

                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="font-bold text-gray-700">
                          {averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 flex-1 line-clamp-2 text-base font-bold text-indigo-950 transition-colors group-hover:text-primary">
                      {course.title || "Untitled course"}
                    </h3>

                    <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium">
                        {course.instructor || "AshCorp Instructor"}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-end border-t border-purple-50 pt-4">
                      <Link
                        href={
                          purchased
                            ? `/play?courseId=${course.id}`
                            : `/course-details/${course.id}#purchase`
                        }
                        className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-purple-600 hover:text-white"
                      >
                        {purchased ? (
                          <>
                            <Play className="h-4 w-4" />
                            Play
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Purchase
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
