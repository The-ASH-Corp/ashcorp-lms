import { Router } from "express";
import { imageUpload } from "../../../shared/middleware/imageUpload";
import {
  blockInstructorController,
  createInstructorController,
  deleteInstructorController,
  getAllInstructorsController,
} from "./controller";



const router = Router();

// create instructor controller
router.post('/create-instructor',imageUpload("profileImage"),createInstructorController);

// get all instructors controller
router.get('/get-all-instructors',getAllInstructorsController);

router.delete('/delete-instructor/:id', deleteInstructorController);

router.patch('/block-instructor/:id', blockInstructorController);

export default router;
