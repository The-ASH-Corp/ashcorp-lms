import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { CouponRepository } from "../../../coupon/domain/repositories/CouponRepository";

export interface CouponPricingResult {
  couponCode: string | null;
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export interface CalculateCouponPricingInput {
  courseId: string;
  couponCode?: string;
  requireCoupon?: boolean;
}

export class CalculateCouponPricingUseCase {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(input: CalculateCouponPricingInput): Promise<CouponPricingResult> {
    const { courseId, couponCode, requireCoupon = false } = input;

    if (!courseId) {
      throw new AppError("courseId is required", 400);
    }

    const course = await this.courseRepository.getCourseById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const baseAmount = Number(course.offerPrice ?? course.price);
    if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
      throw new AppError("Invalid course price", 400);
    }

    const normalizedCouponCode = couponCode?.trim().toUpperCase();
    if (requireCoupon && !normalizedCouponCode) {
      throw new AppError("couponCode is required", 400);
    }

    if (!normalizedCouponCode) {
      return {
        couponCode: null,
        baseAmount,
        discountAmount: 0,
        finalAmount: baseAmount,
      };
    }

    const coupon = await this.couponRepository.findByCode(normalizedCouponCode);
    if (!coupon) {
      throw new AppError("Invalid coupon code", 400);
    }

    const now = new Date();

    if (!coupon.isActive) {
      throw new AppError("Coupon is inactive", 400);
    }

    if (new Date(coupon.applicableFrom) > now) {
      throw new AppError("Coupon is not active yet", 400);
    }

    if (new Date(coupon.validUntil) < now) {
      throw new AppError("Coupon has expired", 400);
    }

    const couponDiscount = Number(coupon.discount);
    if (!Number.isFinite(couponDiscount) || couponDiscount <= 0) {
      throw new AppError("Invalid coupon discount", 400);
    }

    const discountAmount = Math.min(baseAmount, couponDiscount);
    const finalAmount = Math.max(0, baseAmount - discountAmount);

    return {
      couponCode: normalizedCouponCode,
      baseAmount,
      discountAmount,
      finalAmount,
    };
  }
}
