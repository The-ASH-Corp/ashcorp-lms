import { Router } from "express";
import { createExamController, deleteExamController, getExamByCourseController, updateExamController, uploadCertificateController } from "./controller";
import { certificateUpload } from "../../../shared/middleware/certificateUpload";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { requireRole } from "../../../shared/middleware/requireRole";

const router = Router();
const adminOnly = [authMiddleware, requireRole("admin")];

router.post("/create-exam", ...adminOnly, createExamController);

router.get("/get-exams-by-course/:courseId", getExamByCourseController);

router.delete("/delete-exam/:examId", ...adminOnly, deleteExamController);

router.patch("/update-exam/:examId", ...adminOnly, updateExamController);

router.post(
  "/upload-certificate",
  ...adminOnly,
  certificateUpload(),
  uploadCertificateController,
);

export default router;
