import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export interface EnrolledCourseProgress {
  course: NonNullable<Awaited<ReturnType<CourseRepository["getCourseById"]>>>;
  progress: number;
}

export class GetMyCoursesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(studentId: string) {
    const user = await this.userRepository.findById(studentId);

    if (!user) {
      throw new AppError("Student not found", 404);
    }

    const courseProgress = this.normalizeProgress(user.courseProgress);
    const courses = await Promise.all(
      user.purchasedCourses.map(async (courseId) => {
        const course = await this.courseRepository.getCourseById(courseId);
        return course
          ? {
              course,
              progress: courseProgress[courseId] ?? 0,
            }
          : null;
      }),
    );

    return courses.filter((course): course is EnrolledCourseProgress => Boolean(course));
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
