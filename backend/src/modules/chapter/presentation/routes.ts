import { Router } from "express";
import {
  createChapterController,
  deleteChapterController,
  getChapterByCourseController,
} from "./controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/create-chapter",createChapterController)

router.get("/get-chapter-by-course/:id",getChapterByCourseController)

router.delete("/delete-chapter/:id", deleteChapterController)


export default router
