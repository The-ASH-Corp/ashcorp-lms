import { Router } from "express";
import { createExamController, deleteExamController, getExamByCourseController, uploadCertificateController } from "./controller";
import { certificateUpload } from "../../../shared/middleware/certificateUpload";

const router = Router();

router.post("/create-exam", createExamController);

router.get("/get-exams-by-course/:courseId", getExamByCourseController);

router.delete("/delete-exam/:examId", deleteExamController);

router.post("/upload-certificate", certificateUpload(), uploadCertificateController);

export default router;