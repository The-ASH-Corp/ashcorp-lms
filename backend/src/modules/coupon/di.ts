import { MongoCouponRepository } from "./infrastructure/repositories/MongoCouponRepository";
import { CreateCouponUseCase } from "./application/usecase/CreateCouponUseCase";
import { GetAllCouponsUseCase } from "./application/usecase/GetAllCouponsUseCase";
import { DeleteCouponUseCase } from "./application/usecase/DeleteCouponUseCase";
import { ToggleCouponStatusUseCase } from "./application/usecase/ToggleCouponStatusUseCase";
import { GetCouponByIdUseCase } from "./application/usecase/GetCouponByIdUseCase";
import { UpdateCouponUseCase } from "./application/usecase/UpdateCouponUseCase";

export const couponRepository = new MongoCouponRepository();

export const createCouponUseCase = new CreateCouponUseCase(couponRepository);
export const getAllCouponsUseCase = new GetAllCouponsUseCase(couponRepository);
export const getCouponByIdUseCase = new GetCouponByIdUseCase(couponRepository);
export const updateCouponUseCase = new UpdateCouponUseCase(couponRepository);
export const deleteCouponUseCase = new DeleteCouponUseCase(couponRepository);
export const toggleCouponStatusUseCase = new ToggleCouponStatusUseCase(couponRepository);
