import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
} from "./controller";
import { imageUpload } from "../../../shared/middleware/imageUpload";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { requireRole } from "../../../shared/middleware/requireRole";

const router = Router();
const adminOnly = [authMiddleware, requireRole("admin")];


router.post(
  "/create",
  ...adminOnly,
  imageUpload("icon"),
  createCategoryController,
);

router.get("/all-categories",getAllCategoriesController);

router.delete("/delete-category/:id", ...adminOnly, deleteCategoryController);

export default router;
