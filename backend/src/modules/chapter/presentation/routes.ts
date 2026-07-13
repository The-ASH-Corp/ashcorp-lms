import { Router } from "express";
import {
  createChapterController,
  deleteChapterController,
  getChapterByCourseController,
} from "./controller";

const router = Router();

router.post("/create-chapter",createChapterController)

router.get("/get-chapter-by-course/:id",getChapterByCourseController)

router.delete("/delete-chapter/:id", deleteChapterController)


export default router
