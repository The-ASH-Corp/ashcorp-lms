import { Router } from "express";
import authRoutes from "../modules/auth/presentation/routes";
import courseRoutes from "../modules/course/presentation/routes";

const router = Router();

router.use("/auth",authRoutes);
router.use("/course",courseRoutes);


export default router;