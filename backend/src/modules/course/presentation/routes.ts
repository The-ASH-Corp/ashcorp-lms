import { Router } from "express";
import {
  createCourseController,
  deleteCourseController,
  getAllCourseController,
} from "./controller";
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

router.delete("/delete-course/:id", deleteCourseController);

export default router;
