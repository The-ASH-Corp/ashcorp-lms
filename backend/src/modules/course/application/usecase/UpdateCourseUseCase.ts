import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../domain/repositories/CourseRepository";
import { CategoryRepository } from "../../../category/domain/repositories/CategoryRepository";
import { InstructorRepository } from "../../../instructor/domain/repositories/InstructorRepository";
import { isValidObjectId } from "mongoose";
import { Course } from "../../domain/entities/Course";

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
  price?: number;
  offerPrice?: number;
  instructor?: string;
  category?: string;
  imageUrl?: string;
  videoUrl?: string;
  isPublished?: boolean;
}

export class UpdateCourseUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly instructorRepository: InstructorRepository,
  ) {}

  async execute(id: string, courseData: UpdateCoursePayload): Promise<Course> {
    const existingCourse = await this.courseRepository.getCourseById(id);

    if (!existingCourse) {
      throw new AppError("Course not found", 404);
    }

    if (courseData.category && !isValidObjectId(courseData.category)) {
      throw new AppError("Category must be a valid document ID", 400);
    }

    if (courseData.instructor && !isValidObjectId(courseData.instructor)) {
      throw new AppError("Instructor must be a valid document ID", 400);
    }

    if (courseData.category) {
      const category = await this.categoryRepository.findById(courseData.category);
      if (!category) {
        throw new AppError("Category not found", 404);
      }
    }

    if (courseData.instructor) {
      const instructor = await this.instructorRepository.findById(courseData.instructor);
      if (!instructor) {
        throw new AppError("Instructor not found", 404);
      }
    }

    const updatePayload: Record<string, unknown> = {};

    if (courseData.title !== undefined) {
      updatePayload.title = courseData.title;
    }

    if (courseData.description !== undefined) {
      updatePayload.description = courseData.description;
    }

    if (courseData.price !== undefined) {
      updatePayload.price = courseData.price;
    }

    if (courseData.offerPrice !== undefined) {
      updatePayload.offerPrice = courseData.offerPrice;
    }

    if (courseData.instructor !== undefined) {
      updatePayload.instructor = courseData.instructor;
    }

    if (courseData.category !== undefined) {
      updatePayload.category = courseData.category;
    }

    if (courseData.imageUrl !== undefined) {
      updatePayload.imageUrl = courseData.imageUrl;
    }

    if (courseData.videoUrl !== undefined) {
      updatePayload.videoUrl = courseData.videoUrl;
    }

    if (courseData.isPublished !== undefined) {
      updatePayload.isPublished = courseData.isPublished;
    }

    return this.courseRepository.updateCourse(id, updatePayload);
  }
}
