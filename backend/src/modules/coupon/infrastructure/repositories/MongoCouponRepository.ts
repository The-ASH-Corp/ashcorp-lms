import { Coupon, CouponResponseDTO } from "../../domain/entities/Coupon";
import { CouponRepository } from "../../domain/repositories/CouponRepository";
import { CouponModel } from "../models/CouponModel";

export class MongoCouponRepository implements CouponRepository {
  async createCoupon(data: Coupon): Promise<Coupon> {
    return await CouponModel.create(data);
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) return null;
    return new Coupon(
      coupon.code,
      coupon.discount,
      coupon.applicableFrom,
      coupon.validUntil,
      coupon.isActive,
      coupon._id.toString(),
      coupon.createdAt,
      coupon.updatedAt
    );
  }

  async findById(id: string): Promise<Coupon | null> {
    const coupon = await CouponModel.findById(id);
    if (!coupon) return null;
    return new Coupon(
      coupon.code,
      coupon.discount,
      coupon.applicableFrom,
      coupon.validUntil,
      coupon.isActive,
      coupon._id.toString(),
      coupon.createdAt,
      coupon.updatedAt
    );
  }

  async updateCoupon(id: string, data: Coupon): Promise<Coupon | null> {
    const coupon = await CouponModel.findById(id);
    if (!coupon) return null;

    coupon.code = data.code;
    coupon.discount = data.discount;
    coupon.applicableFrom = data.applicableFrom;
    coupon.validUntil = data.validUntil;
    coupon.isActive = data.isActive;

    await coupon.save();

    return new Coupon(
      coupon.code,
      coupon.discount,
      coupon.applicableFrom,
      coupon.validUntil,
      coupon.isActive,
      coupon._id.toString(),
      coupon.createdAt,
      coupon.updatedAt
    );
  }

  async deleteCoupon(id: string): Promise<void> {
    await CouponModel.findByIdAndDelete(id);
  }

  async toggleStatus(id: string): Promise<Coupon | null> {
    const coupon = await CouponModel.findById(id);
    if (!coupon) return null;
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    return new Coupon(
      coupon.code,
      coupon.discount,
      coupon.applicableFrom,
      coupon.validUntil,
      coupon.isActive,
      coupon._id.toString(),
      coupon.createdAt,
      coupon.updatedAt
    );
  }

  async getAllCoupons(): Promise<CouponResponseDTO[]> {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    return coupons.map((coupon) => ({
      id: coupon._id.toString(),
      code: coupon.code,
      discount: coupon.discount,
      applicableFrom: coupon.applicableFrom,
      validUntil: coupon.validUntil,
      isActive: coupon.isActive,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    }));
  }
}
