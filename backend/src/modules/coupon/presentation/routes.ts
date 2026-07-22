import { Router } from "express";
import {
  createCouponController,
  getAllCouponsController,
  getCouponByIdController,
  deleteCouponController,
  updateCouponController,
  toggleCouponStatusController,
} from "./controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { requireRole } from "../../../shared/middleware/requireRole";

const router = Router();
const adminOnly = [authMiddleware, requireRole("admin")];

router.post("/create", ...adminOnly, createCouponController);
router.get("/all-coupons", ...adminOnly, getAllCouponsController);
router.get("/:id", ...adminOnly, getCouponByIdController);
router.patch("/:id", ...adminOnly, updateCouponController);
router.patch("/toggle-status/:id", ...adminOnly, toggleCouponStatusController);
router.delete("/delete-coupon/:id", ...adminOnly, deleteCouponController);

export default router;
