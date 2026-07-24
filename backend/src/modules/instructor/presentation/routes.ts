import { Router } from "express";
import { imageUpload } from "../../../shared/middleware/imageUpload";
import {
  blockInstructorController,
  createInstructorController,
  deleteInstructorController,
  getAllInstructorsController,
  getInstructorByIdController,
  updateInstructorController,
} from "./controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";
import { requireRole } from "../../../shared/middleware/requireRole";



const router = Router();
const adminOnly = [authMiddleware, requireRole("admin")];

// create instructor controller
router.post(
  '/create-instructor',
  ...adminOnly,
  imageUpload("profileImage"),
  createInstructorController,
);

// get all instructors controller
router.get('/get-all-instructors',getAllInstructorsController);

router.get('/get-instructor/:id', getInstructorByIdController);

router.patch('/update-instructor/:id', ...adminOnly, imageUpload("profileImage"), updateInstructorController);

router.delete('/delete-instructor/:id', ...adminOnly, deleteInstructorController);

router.patch('/block-instructor/:id', ...adminOnly, blockInstructorController);

export default router;
