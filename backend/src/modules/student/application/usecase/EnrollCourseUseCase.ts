import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { PurchasedCourse, User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export interface PaymentInfo {
  paymentId: string;
  methodOfPayment: string;
  paymentTime: Date;
  amount: number;
}

export class EnrollCourseUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(studentId: string, courseId: string, paymentInfo?: PaymentInfo): Promise<User> {
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

    const alreadyPurchased = user.purchasedCourses.some((p) => p.courseId === courseId);

    if (alreadyPurchased) {
      await this.courseRepository.addEnrolledStudent(courseId, studentId);
      return user;
    }

    const newEntry: PurchasedCourse = {
      courseId,
      paymentId: paymentInfo?.paymentId ?? "free",
      methodOfPayment: paymentInfo?.methodOfPayment ?? "free",
      paymentTime: paymentInfo?.paymentTime ?? new Date(),
      amount: paymentInfo?.amount ?? 0,
    };

    const purchasedCourses = [...user.purchasedCourses, newEntry];
    const wishlist = user.wishlist.filter((id) => id !== courseId);

    const updatedUser = await this.userRepository.update(studentId, {
      purchasedCourses,
      wishlist,
    });

    await this.courseRepository.addEnrolledStudent(courseId, studentId);

    return updatedUser;
  }
}
