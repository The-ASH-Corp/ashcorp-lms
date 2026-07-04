import { Router } from "express";
import { createCategoryController, getAllCategoriesController } from "./controller";
import { imageUpload } from "../../../shared/middleware/imageUpload";

const router = Router();

router.post("/create", imageUpload("icon"), createCategoryController);

router.get("/all-categories",getAllCategoriesController);

export default router;
