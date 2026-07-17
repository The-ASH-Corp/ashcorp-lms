import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export class UpdateCourseProgressUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(studentId: string, courseId: string, progress: number): Promise<User> {
    const [user, course] = await Promise.all([
      this.userRepository.findById(studentId),
      this.courseRepository.getCourseById(courseId),
    ]);

    if (!user) {
      throw new AppError("Student not found", 404);
    }

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    if (!user.purchasedCourses.includes(courseId)) {
      throw new AppError("Enroll this course before updating progress", 403);
    }

    const normalizedProgress = Math.min(100, Math.max(0, Math.round(progress)));
    const courseProgress = this.normalizeProgress(user.courseProgress);

    return this.userRepository.update(studentId, {
      courseProgress: {
        ...courseProgress,
        [courseId]: Math.max(courseProgress[courseId] ?? 0, normalizedProgress),
      },
    });
  }

  private normalizeProgress(progress: unknown): Record<string, number> {
    if (!progress) {
      return {};
    }

    if (progress instanceof Map) {
      return Object.fromEntries(progress.entries());
    }

    return progress as Record<string, number>;
  }
}
