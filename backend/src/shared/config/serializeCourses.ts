import mongoose from "mongoose";
import { CourseResponseDTO } from "../../modules/course/application/dto/CourseDTO";
import { categoryRepository } from "../../modules/category/di";
import { instructorRepository } from "../../modules/instructor/di";
import { userRepository } from "../../modules/auth/di";

export const serializeCourse = async (course: any): Promise<CourseResponseDTO> => {
  const rawCourse =
    typeof course?.toObject === "function" ? course.toObject() : course;

  const categoryRef = String(rawCourse?.category ?? "");
  const instructorRef = String(rawCourse?.instructor ?? "");
  const categoryLookup = mongoose.isValidObjectId(categoryRef)
    ? categoryRepository.findById(categoryRef)
    : Promise.resolve(null);
  const instructorLookup = mongoose.isValidObjectId(instructorRef)
    ? instructorRepository.findById(instructorRef)
    : Promise.resolve(null);

  const [category, instructor] = await Promise.all([
    categoryLookup,
    instructorLookup,
  ]);

  const ratings = await Promise.all(
    (rawCourse.rating || []).map(async (item: any) => {
      const user = mongoose.isValidObjectId(item.userId)
        ? await userRepository.findById(item.userId)
        : null;

      return {
        userId: item.userId,
        userName: user?.name ?? "Unknown User",
        rating: item.rating,
        review: item.review,
        createdAt: item.createdAt,
      };
    }),
  );

  const dbRatingsCount = ratings.length;
  const dbAvgRating = dbRatingsCount > 0
    ? Number((ratings.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / dbRatingsCount).toFixed(1))
    : 0;

  const ratingSource = (rawCourse?.ratingSource === "admin" ? "admin" : "db") as "db" | "admin";
  const staticRating = Number(rawCourse?.staticRating ?? 0);
  const staticRatingCount = Number(rawCourse?.staticRatingCount ?? 0);
  const staticEnrolledCount = Number(rawCourse?.staticEnrolledCount ?? 0);
  const dbEnrolledStudents = Array.isArray(rawCourse?.enrolledStudents)
    ? rawCourse.enrolledStudents.map((studentId: unknown) => String(studentId))
    : [];
  const dbEnrolledCount = dbEnrolledStudents.length;

  const effectiveRating = ratingSource === "admin"
    ? staticRating
    : dbAvgRating;

  const totalReviews = ratingSource === "admin"
    ? (staticRatingCount > 0 ? staticRatingCount : dbRatingsCount)
    : dbRatingsCount;

  const effectiveEnrolledCount = ratingSource === "admin"
    ? (staticEnrolledCount > 0 ? staticEnrolledCount : dbEnrolledCount)
    : dbEnrolledCount;

  return {
    id: String(rawCourse?._id ?? rawCourse?.id ?? ""),
    title: String(rawCourse?.title ?? ""),
    description: String(rawCourse?.description ?? ""),
    price: Number(rawCourse?.price ?? 0),
    offerPrice: Number(rawCourse?.offerPrice ?? 0),
    instructor: instructor?.name ?? (mongoose.isValidObjectId(instructorRef) ? "Unknown Instructor" : instructorRef),
    instructorTitle: instructor?.instructorTitle ?? "",
    instructorProfileImage: instructor?.profileImage ?? "",
    category: category?.categoryName ?? categoryRef,
    imageUrl: String(rawCourse?.imageUrl ?? ""),
    videoUrl: String(rawCourse?.videoUrl ?? ""),
    chapters: Array.isArray(rawCourse?.chapters) ? rawCourse.chapters : [],
    enrolledStudents: dbEnrolledStudents,
    isPublished: Boolean(rawCourse?.isPublished ?? false),
    status: String(rawCourse?.status ?? "Active"),
    rating: ratings,
    ratingSource,
    staticRating,
    staticRatingCount,
    staticEnrolledCount,
    effectiveRating,
    totalReviews,
    effectiveEnrolledCount,
    createdAt: rawCourse?.createdAt
      ? new Date(rawCourse.createdAt)
      : new Date(),
    updatedAt: rawCourse?.updatedAt
      ? new Date(rawCourse.updatedAt)
      : new Date(),
  };
};
