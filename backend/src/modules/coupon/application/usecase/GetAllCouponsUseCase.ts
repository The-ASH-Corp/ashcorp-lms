import { CouponResponseDTO } from "../../domain/entities/Coupon";
import { CouponRepository } from "../../domain/repositories/CouponRepository";

export class GetAllCouponsUseCase {
  constructor(private readonly couponRepository: CouponRepository) {}

  async execute(): Promise<CouponResponseDTO[]> {
    return await this.couponRepository.getAllCoupons();
  }
}
