import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export interface AdminPaymentRecord {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  paymentId: string;
  methodOfPayment: string;
  paymentTime: string | null;
  amount: number;
}

export class GetAdminPaymentsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(): Promise<AdminPaymentRecord[]> {
    const users = await this.userRepository.findAll();

    const payments = await Promise.all(
      users.flatMap(async (user) => {
        if (!user.purchasedCourses?.length) {
          return [] as AdminPaymentRecord[];
        }

        return Promise.all(
          user.purchasedCourses.map(async (purchase) => {
            const course = await this.courseRepository.getCourseById(
              String(purchase.courseId),
            );

            return {
              studentId: String(user._id ?? ""),
              studentName: user.name,
              studentEmail: user.email,
              courseId: String(purchase.courseId),
              courseTitle: course?.title ?? "Course removed",
              paymentId: purchase.paymentId,
              methodOfPayment: purchase.methodOfPayment,
              paymentTime: purchase.paymentTime
                ? new Date(purchase.paymentTime).toISOString()
                : null,
              amount: Number(purchase.amount ?? 0),
            } satisfies AdminPaymentRecord;
          }),
        );
      }),
    );

    return payments
      .flat()
      .sort((first, second) => {
        const firstTime = first.paymentTime ? new Date(first.paymentTime).getTime() : 0;
        const secondTime = second.paymentTime ? new Date(second.paymentTime).getTime() : 0;

        return secondTime - firstTime;
      });
  }
}
