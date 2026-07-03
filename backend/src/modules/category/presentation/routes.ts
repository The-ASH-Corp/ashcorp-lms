import { Router } from "express";
import { createCategoryController } from "./controller";
import { imageUpload } from "../../../shared/middleware/imageUpload";

const router = Router();

router.post("/create", imageUpload("icon"), createCategoryController);

export default router;
