"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ShoppingCart, Star } from "lucide-react";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import { useGetCurrentUserQuery } from "@/lib/redux/features/auth/authApi";
import { useAppSelector } from "@/lib/redux/hooks";

const getCourseImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return "";

  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith("/")) return imageUrl;

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
  const path = imageUrl.replace(/\\/g, "/").replace(/^\/+/, "");

  return baseUrl ? `${baseUrl}/${path}` : `/${path}`;
};

export default function TrendingWorkshops() {
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !authUser,
  });
  const user = currentUser ?? authUser;
  const { data: courses = [], isLoading } = useGetAllCourseQuery();

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

  let displayedCourses: typeof sortedAllCourses = [];

  if (mostPurchased.length >= 3) {
    displayedCourses = mostPurchased.slice(0, 3);
  } else {
    const usedCourseIds = new Set(mostPurchased.map((course) => course.id));
    const remainingCourses = sortedAllCourses.filter(
      (course) => !usedCourseIds.has(course.id),
    );

    displayedCourses = [
      ...mostPurchased,
      ...remainingCourses.slice(0, 3 - mostPurchased.length),
    ];
  }

  const isPurchased = (courseId: string) =>
    Boolean(
      user?.purchasedCourses?.some(
        (purchasedCourse) => String(purchasedCourse.courseId) === courseId,
      ),
    );

  return (
    <section className="bg-purple-50/20 py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-950">
            Trending Courses
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            The most purchased courses right now.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-sm text-gray-500">
            Loading trending courses...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayedCourses.map((course) => {
              const averageRating = course.rating?.length
                ? course.rating.reduce((sum, item) => sum + item.rating, 0) /
                  course.rating.length
                : 0;
              const courseImage = getCourseImageUrl(course.imageUrl);
              const purchased = isPurchased(course.id);

              return (
                <div
                  key={course.id}
                  className="flex flex-col overflow-hidden rounded-3xl bg-white border border-purple-50 shadow-xs hover:shadow-md transition-shadow group"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <Image
                      src={courseImage || "/images/course-placeholder.png"}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-indigo-950 px-3 py-1 text-xs font-semibold text-white">
                      Most Purchased
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-semibold text-primary uppercase tracking-wider">
                        {course.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                        <span className="font-bold text-gray-700">
                          {averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 flex-1 text-base font-bold text-indigo-950 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium">{course.instructor}</span>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-purple-50">
                      <div>
                        {/* <p className="text-sm text-gray-500">Enrolled</p>
                        <p className="text-lg font-bold text-indigo-950">
                          {course.enrolledStudents?.length ?? 0}
                        </p> */}
                      </div>
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
                            <Play className="h-4 w-4" /> Play
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" /> Purchase
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
