import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
} from "./controller";
import { imageUpload } from "../../../shared/middleware/imageUpload";

const router = Router();

router.post("/create", imageUpload("icon"), createCategoryController);

router.get("/all-categories",getAllCategoriesController);

router.delete("/delete-category/:id", deleteCategoryController);

export default router;
