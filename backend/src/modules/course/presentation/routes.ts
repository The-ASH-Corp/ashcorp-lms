import { Router } from "express";
import {
  addReviewController,
  createCourseController,
  getLandingStatsController,
  deleteCourseController,
  getAllCourseController,
  getCourseByIdController,
  makeCourseFreeAndPublishedController,
  updateCourseController,
} from "./controller";
import { fileUpload } from "../../../shared/middleware/fileUpload";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { requireRole } from "../../../shared/middleware/requireRole";

const router = Router();
const adminOnly = [authMiddleware, requireRole("admin")];

router.post(
  "/create",
  ...adminOnly,
  fileUpload([
    { name: "thumbnail", maxCount: 1 },
    { name: "introVideo", maxCount: 1 },
  ]),
  createCourseController,
);

router.get("/all-course", getAllCourseController);

router.get("/landing-stats", getLandingStatsController);

router.get("/:id", getCourseByIdController);

router.patch(
  "/make-free-publish/:id",
  ...adminOnly,
  makeCourseFreeAndPublishedController,
);

router.patch(
  "/update-course/:id",
  ...adminOnly,
  fileUpload([
    { name: "thumbnail", maxCount: 1 },
    { name: "introVideo", maxCount: 1 },
  ]),
  updateCourseController,
);

router.delete("/delete-course/:id", ...adminOnly, deleteCourseController);

router.post("/:courseId/review", authMiddleware, addReviewController); 

export default router;
