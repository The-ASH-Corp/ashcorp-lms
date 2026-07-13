import { AppError } from "../../../../shared/error/AppError";
import { Coupon } from "../../domain/entities/Coupon";
import { CouponRepository } from "../../domain/repositories/CouponRepository";

export class CreateCouponUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(coupon: Coupon): Promise<Coupon> {
    if (!coupon.code || coupon.discount === undefined || !coupon.applicableFrom || !coupon.validUntil) {
      throw new AppError("Coupon code, discount, start date, and expiry date are required", 400);
    }

    if (!Number.isFinite(coupon.discount) || coupon.discount <= 0) {
      throw new AppError("Discount must be greater than 0", 400);
    }

    if (new Date(coupon.applicableFrom) > new Date(coupon.validUntil)) {
      throw new AppError("Start date cannot be after expiry date", 400);
    }

    coupon.code = coupon.code.trim().toUpperCase();

    if (new Date(coupon.validUntil) < new Date()) {
      coupon.isActive = false;
    }

    const existingCoupon = await this.couponRepository.findByCode(coupon.code);
    if (existingCoupon) {
      throw new AppError("Coupon with this code already exists", 400);
    }

    return await this.couponRepository.createCoupon(coupon);
  }
}
