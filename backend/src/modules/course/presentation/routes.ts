import { Router } from "express";
import { createCourseController, getAllCourseController, getCourseByIdController } from "./controller";
import { fileUpload } from "../../../shared/middleware/fileUpload";

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

export default router;