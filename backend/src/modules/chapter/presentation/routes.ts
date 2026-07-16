import { Router } from "express";
import {
  createChapterController,
  deleteChapterController,
  getChapterByCourseController,
} from "./controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { fileUpload } from "../../../shared/middleware/fileUpload";

const router = Router();

router.use(authMiddleware);

router.post(
  "/create-chapter",
  fileUpload([{ name: "files", maxCount: 50 }]),
  createChapterController,
)

router.get("/get-chapter-by-course/:id",getChapterByCourseController)

router.delete("/delete-chapter/:id", deleteChapterController)


export default router
