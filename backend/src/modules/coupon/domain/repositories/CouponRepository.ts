import { Coupon, CouponResponseDTO } from "../entities/Coupon";

export interface CouponRepository {
  createCoupon(data: Coupon): Promise<Coupon>;
  findByCode(code: string): Promise<Coupon | null>;
  findById(id: string): Promise<Coupon | null>;
  updateCoupon(id: string, data: Coupon): Promise<Coupon | null>;
  deleteCoupon(id: string): Promise<void>;
  toggleStatus(id: string): Promise<Coupon | null>;
  getAllCoupons(): Promise<CouponResponseDTO[]>;
}
