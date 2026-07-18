import { Router } from "express";
import { createExamController, deleteExamController, getExamByCourseController } from "./controller";

const router = Router();

router.post("/create-exam",createExamController)

router.get("/get-exams-by-course/:courseId",getExamByCourseController)

router.delete("/delete-exam/:examId",deleteExamController)

export default router;