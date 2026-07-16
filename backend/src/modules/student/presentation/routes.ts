import { Router } from "express";
import { validate } from "../../../shared/middleware/validator";
import { registerSchema } from "../../auth/presentation/validators";
import {
  addToWishlistController,
  blockStudentController,
  createStudentController,
  deleteStudentController,
  enrollCourseController,
  getAllStudentsController,
  getWishlistController,
  removeFromWishlistController,
} from "./controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

// Create a new student (reuses auth register validation)
router.post("/create-student", validate(registerSchema), createStudentController);

// Get all students
router.get("/get-all-students", getAllStudentsController);

// delete student
router.delete("/delete-student/:id", deleteStudentController);

// block student
router.patch("/block-student/:id", blockStudentController);

// add to wishlist
router.post("/add-to-wishlist",addToWishlistController);

// remove from wishlist
router.post("/remove-from-wishlist", removeFromWishlistController);

// get wishlist
router.get("/get-wishlist", getWishlistController);

// enroll course
router.post("/enroll-course", enrollCourseController);

export default router;
