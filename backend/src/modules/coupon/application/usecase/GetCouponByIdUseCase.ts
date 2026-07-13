import { AppError } from "../../../../shared/error/AppError";
import { Coupon } from "../../domain/entities/Coupon";
import { CouponRepository } from "../../domain/repositories/CouponRepository";

export class GetCouponByIdUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(id: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new AppError("Coupon not found", 404);
    }

    return coupon;
  }
}
