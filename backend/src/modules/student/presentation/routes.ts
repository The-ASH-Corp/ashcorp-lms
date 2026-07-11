import { Router } from "express";
import { validate } from "../../../shared/middleware/validator";
import { registerSchema } from "../../auth/presentation/validators";
import {
  blockStudentController,
  createStudentController,
  deleteStudentController,
  getAllStudentsController,
} from "./controller";

const router = Router();

// Create a new student (reuses auth register validation)
router.post("/create-student", validate(registerSchema), createStudentController);

// Get all students
router.get("/get-all-students", getAllStudentsController);

router.delete("/delete-student/:id", deleteStudentController);

router.patch("/block-student/:id", blockStudentController);

export default router;
