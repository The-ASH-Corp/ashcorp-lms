import { Router } from "express";
import {
  addReviewController,
  createCourseController,
  deleteCourseController,
  getAllCourseController,
  getCourseByIdController,
  makeCourseFreeAndPublishedController,
} from "./controller";
import { fileUpload } from "../../../shared/middleware/fileUpload";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";

const router = Router();

router.post(
  "/create",
  fileUpload([
    { name: "thumbnail", maxCount: 1 },
    { name: "introVideo", maxCount: 1 },
  ]),
  createCourseController,
);

router.get("/all-course", getAllCourseController);

router.get("/:id", getCourseByIdController);

router.patch("/make-free-publish/:id", makeCourseFreeAndPublishedController);

router.delete("/delete-course/:id", deleteCourseController);

router.post("/:courseId/review", authMiddleware, addReviewController); 

export default router;
