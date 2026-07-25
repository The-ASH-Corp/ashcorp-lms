import { CouponPricingResult, CalculateCouponPricingUseCase } from "./CalculateCouponPricingUseCase";

export interface ValidateCouponInput {
  courseId: string;
  couponCode: string;
}

export class ValidateCouponUseCase {
  constructor(
    private readonly calculateCouponPricingUseCase: CalculateCouponPricingUseCase,
  ) {}

  async execute(input: ValidateCouponInput): Promise<CouponPricingResult> {
    return this.calculateCouponPricingUseCase.execute({
      courseId: input.courseId,
      couponCode: input.couponCode,
      requireCoupon: true,
    });
  }
}
