import crypto from "crypto";
import { ENV } from "../../../../shared/env/ENV";
import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { User } from "../../../users/domain/entities/User";
import { EnrollCourseUseCase } from "./EnrollCourseUseCase";

type RazorpayClient = any;

export interface VerifyPaymentInput {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

export class VerifyPaymentUseCase {
  constructor(
    private readonly enrollCourseUseCase: EnrollCourseUseCase,
    private readonly courseRepository: CourseRepository,
    private readonly razorpayClient: RazorpayClient,
  ) {}

  async execute(studentId: string, input: VerifyPaymentInput): Promise<User> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = input;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new AppError("Missing payment verification fields", 400);
    }

    const expectedSignature = crypto
      .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new AppError("Payment verification failed", 400);
    }

    const [orderDetails, paymentDetails] = await Promise.all([
      this.razorpayClient.orders.fetch(String(razorpay_order_id)),
      this.razorpayClient.payments.fetch(String(razorpay_payment_id)),
    ]);

    if (paymentDetails.order_id !== orderDetails.id) {
      throw new AppError("Payment does not belong to this order", 400);
    }

    const orderStudentId = String(orderDetails.notes?.studentId ?? "");
    const orderCourseId = String(orderDetails.notes?.courseId ?? "");

    if (!orderStudentId || orderStudentId !== studentId) {
      throw new AppError("Payment order does not belong to this user", 403);
    }

    if (!orderCourseId) {
      throw new AppError("Payment order is missing course information", 400);
    }

    if (
      orderDetails.status !== "paid" ||
      paymentDetails.status !== "captured" ||
      !paymentDetails.captured
    ) {
      throw new AppError("Payment has not been completed", 400);
    }

    const orderAmount = Number(orderDetails.amount);
    const paidAmount = Number(paymentDetails.amount);
    const orderPaidAmount = Number(orderDetails.amount_paid);

    if (
      orderDetails.currency !== paymentDetails.currency ||
      orderAmount !== paidAmount ||
      orderAmount !== orderPaidAmount
    ) {
      throw new AppError("Payment amount verification failed", 400);
    }

    const course = await this.courseRepository.getCourseById(orderCourseId);
    if (!course) throw new AppError("Course not found", 404);

    const expectedCourseAmount = Math.round(
      Number(course.offerPrice ?? course.price) * 100,
    );
    const expectedOrderAmountFromNotes = Number(orderDetails.notes?.finalAmountPaise ?? "");
    const expectedAmount = Number.isFinite(expectedOrderAmountFromNotes) && expectedOrderAmountFromNotes > 0
      ? expectedOrderAmountFromNotes
      : expectedCourseAmount;

    if (orderAmount !== expectedAmount) {
      throw new AppError("Payment amount does not match course price", 400);
    }

    return this.enrollCourseUseCase.execute(studentId, orderCourseId, {
      paymentId: razorpay_payment_id,
      methodOfPayment: String(paymentDetails.method ?? "razorpay"),
      paymentTime: new Date(Number(paymentDetails.created_at) * 1000),
      amount: paidAmount / 100,
    });
  }
}
