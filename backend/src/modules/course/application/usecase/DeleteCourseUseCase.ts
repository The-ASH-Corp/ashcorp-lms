import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../domain/repositories/CourseRepository";

export class DeleteCourseUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(id: string): Promise<void> {
    const course = await this.courseRepository.getCourseById(id);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    await this.courseRepository.deleteCourse(id);
  }
}
