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

router.use(authMiddleware, requireRole("admin"));

router.post("/create", createCouponController);
router.get("/all-coupons", getAllCouponsController);
router.get("/:id", getCouponByIdController);
router.patch("/:id", updateCouponController);
router.patch("/toggle-status/:id", toggleCouponStatusController);
router.delete("/delete-coupon/:id", deleteCouponController);

export default router;
