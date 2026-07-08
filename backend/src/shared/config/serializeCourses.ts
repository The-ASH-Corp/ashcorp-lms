import mongoose from "mongoose";
import { CourseResponseDTO } from "../../modules/course/application/dto/CourseDTO";
import { categoryRepository } from "../../modules/category/di";
import { instructorRepository } from "../../modules/instructor/di";

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

  return {
    id: String(rawCourse?._id ?? rawCourse?.id ?? ""),
    title: String(rawCourse?.title ?? ""),
    description: String(rawCourse?.description ?? ""),
    price: Number(rawCourse?.price ?? 0),
    offerPrice: Number(rawCourse?.offerPrice ?? 0),
    instructor: instructor?.name ?? instructorRef,
    category: category?.categoryName ?? categoryRef,
    imageUrl: String(rawCourse?.imageUrl ?? ""),
    videoUrl: String(rawCourse?.videoUrl ?? ""),
    chapters: Array.isArray(rawCourse?.chapters) ? rawCourse.chapters : [],
    isPublished: Boolean(rawCourse?.isPublished ?? false),
    status: String(rawCourse?.status ?? "Active"),
    createdAt: rawCourse?.createdAt
      ? new Date(rawCourse.createdAt)
      : new Date(),
    updatedAt: rawCourse?.updatedAt
      ? new Date(rawCourse.updatedAt)
      : new Date(),
  };
};
