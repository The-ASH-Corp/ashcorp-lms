import { Router } from "express";
import { imageUpload } from "../../../shared/middleware/imageUpload";
import { createInstructorController, getAllInstructorsController } from "./controller";



const router = Router();

// create instructor controller
router.post('/create-instructor',imageUpload("profileImage"),createInstructorController);

// get all instructors controller
router.get('/get-all-instructors',getAllInstructorsController);

export default router;