import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export class EnrollCourseUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(studentId: string, courseId: string): Promise<User> {
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

    if (user.purchasedCourses.includes(courseId)) {
      await this.courseRepository.addEnrolledStudent(courseId, studentId);
      return user;
    }

    const purchasedCourses = [...user.purchasedCourses, courseId];
    const wishlist = user.wishlist.filter((id) => id !== courseId);

    const updatedUser = await this.userRepository.update(studentId, {
      purchasedCourses,
      wishlist,
    });

    await this.courseRepository.addEnrolledStudent(courseId, studentId);

    return updatedUser;
  }
}
