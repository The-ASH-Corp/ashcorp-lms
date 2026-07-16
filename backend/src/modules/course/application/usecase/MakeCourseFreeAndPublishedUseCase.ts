import { AppError } from "../../../../shared/error/AppError";
import { Course } from "../../domain/entities/Course";
import { CourseRepository } from "../../domain/repositories/CourseRepository";

export class MakeCourseFreeAndPublishedUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(id: string): Promise<Course> {
    const course = await this.courseRepository.getCourseById(id);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    return this.courseRepository.makeCourseFreeAndPublished(id);
  }
}
