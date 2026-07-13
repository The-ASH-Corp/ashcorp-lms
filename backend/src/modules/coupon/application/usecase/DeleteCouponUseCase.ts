import { AppError } from "../../../../shared/error/AppError";
import { CouponRepository } from "../../domain/repositories/CouponRepository";

export class DeleteCouponUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(id: string): Promise<void> {
    const existingCoupon = await this.couponRepository.findById(id);
    if (!existingCoupon) {
      throw new AppError("Coupon not found", 404);
    }
    await this.couponRepository.deleteCoupon(id);
  }
}
