import { Router } from "express";
import authRoutes from "../modules/auth/presentation/routes";
import courseRoutes from "../modules/course/presentation/routes";
import categoryRoutes from "../modules/category/presentation/routes";
import instructorRoutes from "../modules/instructor/presentation/routes";
import chapterRoutes from "../modules/chapter/presentation/routes";
import studentRoutes from "../modules/student/presentation/routes";
import couponRoutes from "../modules/coupon/presentation/routes";
import examRoutes from "../modules/exam/presentation/routes";
import graduateRouter from "../modules/graduates/presentation/routes";

const router = Router();

router.use("/auth",authRoutes);

router.use("/course",courseRoutes);

router.use("/category",categoryRoutes);

router.use("/instructor",instructorRoutes);

router.use("/chapters",chapterRoutes);

router.use("/student",studentRoutes);

router.use("/coupon", couponRoutes);

router.use("/exam", examRoutes);

router.use("/graduate",graduateRouter);

export default router;