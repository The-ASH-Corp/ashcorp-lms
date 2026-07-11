import { Router } from "express";
import { createChapterController, getChapterByCourseController } from "./controller";

const router = Router();

router.post("/create-chapter",createChapterController)

router.get("/get-chapter-by-course/:id",getChapterByCourseController)


export default router