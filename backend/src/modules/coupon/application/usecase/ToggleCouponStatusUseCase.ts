import { AppError } from "../../../../shared/error/AppError";
import { Coupon } from "../../domain/entities/Coupon";
import { CouponRepository } from "../../domain/repositories/CouponRepository";

export class ToggleCouponStatusUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(id: string): Promise<Coupon> {
    const existingCoupon = await this.couponRepository.findById(id);
    if (!existingCoupon) {
      throw new AppError("Coupon not found", 404);
    }

    if (new Date(existingCoupon.validUntil) < new Date()) {
      throw new AppError("Cannot toggle an expired coupon", 400);
    }

    const toggled = await this.couponRepository.toggleStatus(id);
    if (!toggled) {
      throw new AppError("Coupon not found", 404);
    }
    return toggled;
  }
}
