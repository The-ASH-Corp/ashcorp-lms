import { Router } from "express";
import { validate } from "../../../shared/middleware/validator";
import { registerSchema } from "../../auth/presentation/validators";
import {
  addToWishlistController,
  blockStudentController,
  createOrderController,
  createStudentController,
  deleteStudentController,
  enrollCourseController,
  getAllStudentsController,
  getExamAttemptController,
  getMyCoursesController,
  getStudentByIdController,
  getWishlistController,
  removeFromWishlistController,
  saveExamResponseController,
  updateCourseProgressController,
  updateProfileController,
  verifyPaymentController,
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

// get enrolled courses
router.get("/my-courses", getMyCoursesController);

// update course progress
router.patch("/course-progress", updateCourseProgressController);

// update profile
router.patch("/update-profile", updateProfileController);

// save exam response
router.post("/exam-response", saveExamResponseController);

// get saved exam attempt for a course
router.get("/exam-attempt/:courseId", getExamAttemptController);

// get user by id 
router.get("/get-student-by-Id/:id", getStudentByIdController);

// razorpay: create order
router.post("/create-order", createOrderController);

// razorpay: verify payment & enroll
router.post("/verify-payment", verifyPaymentController);

export default router;
