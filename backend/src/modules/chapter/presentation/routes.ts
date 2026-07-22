import { Router } from "express";
import {
  createChapterController,
  deleteChapterController,
  getChapterByCourseController,
} from "./controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { requireRole } from "../../../shared/middleware/requireRole";
import { fileUpload } from "../../../shared/middleware/fileUpload";

const router = Router();
const adminOnly = [authMiddleware, requireRole("admin")];

router.post(
  "/create-chapter",
  ...adminOnly,
  fileUpload([{ name: "files", maxCount: 50 }]),
  createChapterController,
)

router.get("/get-chapter-by-course/:id",getChapterByCourseController)

router.delete("/delete-chapter/:id", ...adminOnly, deleteChapterController)


export default router
