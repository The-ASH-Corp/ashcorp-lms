import { ENV } from "../../../../shared/env/ENV";
import { AppError } from "../../../../shared/error/AppError";
import { CalculateCouponPricingUseCase } from "./CalculateCouponPricingUseCase";

type RazorpayClient = any;

export interface CreateOrderInput {
  studentId: string;
  courseId: string;
  couponCode?: string;
}

export interface CreateOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  couponCode: string | null;
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export class CreateOrderUseCase {
  constructor(
    private readonly razorpayClient: RazorpayClient,
    private readonly calculateCouponPricingUseCase: CalculateCouponPricingUseCase,
  ) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderResult> {
    const { studentId, courseId, couponCode } = input;

    if (!studentId) {
      throw new AppError("studentId is required", 400);
    }

    const pricing = await this.calculateCouponPricingUseCase.execute({
      courseId,
      couponCode,
    });

    const amount = Math.round(pricing.finalAmount * 100);
    if (!amount || amount <= 0) {
      throw new AppError("Invalid payable amount", 400);
    }

    const order = await this.razorpayClient.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${courseId}_${Date.now()}`.substring(0, 40),
      notes: {
        courseId,
        studentId,
        couponCode: pricing.couponCode ?? "",
        baseAmountPaise: String(Math.round(pricing.baseAmount * 100)),
        discountAmountPaise: String(Math.round(pricing.discountAmount * 100)),
        finalAmountPaise: String(amount),
      },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: ENV.RAZORPAY_KEY_ID,
      couponCode: pricing.couponCode,
      baseAmount: pricing.baseAmount,
      discountAmount: pricing.discountAmount,
      finalAmount: pricing.finalAmount,
    };
  }
}
