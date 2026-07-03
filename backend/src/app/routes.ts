import { Router } from "express";
import authRoutes from "../modules/auth/presentation/routes";
import courseRoutes from "../modules/course/presentation/routes";
import categoryRoutes from "../modules/category/presentation/routes";

const router = Router();

router.use("/auth",authRoutes);
router.use("/course",courseRoutes);
router.use("/category",categoryRoutes);


export default router;