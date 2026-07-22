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

  return {
    id: String(rawCourse?._id ?? rawCourse?.id ?? ""),
    title: String(rawCourse?.title ?? ""),
    description: String(rawCourse?.description ?? ""),
    price: Number(rawCourse?.price ?? 0),
    offerPrice: Number(rawCourse?.offerPrice ?? 0),
    instructor: instructor?.name ?? instructorRef,
    instructorTitle: instructor?.instructorTitle ?? "",
    category: category?.categoryName ?? categoryRef,
    imageUrl: String(rawCourse?.imageUrl ?? ""),
    videoUrl: String(rawCourse?.videoUrl ?? ""),
    chapters: Array.isArray(rawCourse?.chapters) ? rawCourse.chapters : [],
    enrolledStudents: Array.isArray(rawCourse?.enrolledStudents)
      ? rawCourse.enrolledStudents.map((studentId: unknown) =>
          String(studentId),
        )
      : [],
    isPublished: Boolean(rawCourse?.isPublished ?? false),
    status: String(rawCourse?.status ?? "Active"),
    rating: ratings,
    createdAt: rawCourse?.createdAt
      ? new Date(rawCourse.createdAt)
      : new Date(),
    updatedAt: rawCourse?.updatedAt
      ? new Date(rawCourse.updatedAt)
      : new Date(),
  };
};
