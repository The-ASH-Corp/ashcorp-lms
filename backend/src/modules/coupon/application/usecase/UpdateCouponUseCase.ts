import { AppError } from "../../../../shared/error/AppError";
import { Coupon } from "../../domain/entities/Coupon";
import { CouponRepository } from "../../domain/repositories/CouponRepository";

export class UpdateCouponUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(id: string, coupon: Coupon): Promise<Coupon> {
    const existingCoupon = await this.couponRepository.findById(id);
    if (!existingCoupon) {
      throw new AppError("Coupon not found", 404);
    }

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

    const duplicateCoupon = await this.couponRepository.findByCode(coupon.code);
    if (duplicateCoupon && duplicateCoupon.id !== id) {
      throw new AppError("Coupon with this code already exists", 400);
    }

    if (new Date(coupon.validUntil) < new Date()) {
      coupon.isActive = false;
    }

    const updatedCoupon = await this.couponRepository.updateCoupon(id, coupon);
    if (!updatedCoupon) {
      throw new AppError("Coupon not found", 404);
    }

    return updatedCoupon;
  }
}
