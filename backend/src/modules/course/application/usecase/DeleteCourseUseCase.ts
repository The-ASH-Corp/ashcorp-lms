import { AppError } from "../../../../shared/error/AppError";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { CourseRepository } from "../../domain/repositories/CourseRepository";

export class DeleteCourseUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const course = await this.courseRepository.getCourseById(id);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const hasEnrolledStudents = await this.userRepository.hasPurchasedCourse(id);

    if (hasEnrolledStudents) {
      throw new AppError("Cannot delete course because students are enrolled", 400);
    }

    await this.courseRepository.deleteCourse(id);
  }
}
