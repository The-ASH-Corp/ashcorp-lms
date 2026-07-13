import { NextFunction, Request, Response } from "express";
import {
  createCouponUseCase,
  getAllCouponsUseCase,
  getCouponByIdUseCase,
  deleteCouponUseCase,
  updateCouponUseCase,
  toggleCouponStatusUseCase,
} from "../di";
import { Coupon } from "../domain/entities/Coupon";

export const createCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, discount, applicableFrom, validUntil, isActive, } = req.body;

    const coupon = new Coupon(
      code,
      Number(discount),
      new Date(applicableFrom),
      new Date(validUntil),
      isActive !== undefined ? Boolean(isActive) : true,
    );

    const createdCoupon = await createCouponUseCase.execute(coupon);

    res.status(201).json({
      success: true,
      data: createdCoupon,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCouponsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const coupons = await getAllCouponsUseCase.execute();
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

export const getCouponByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const coupon = await getCouponByIdUseCase.execute(id);

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { code, discount, applicableFrom, validUntil, isActive } = req.body;

    const coupon = new Coupon(
      code,
      Number(discount),
      new Date(applicableFrom),
      new Date(validUntil),
      isActive !== undefined ? Boolean(isActive) : true,
    );

    const updatedCoupon = await updateCouponUseCase.execute(id, coupon);

    res.status(200).json({
      success: true,
      data: updatedCoupon,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteCouponUseCase.execute(id);
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCouponStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updated = await toggleCouponStatusUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
