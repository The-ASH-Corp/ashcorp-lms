import { Router } from "express";
import { loginSchema, registerSchema } from "./validators";
import { validate } from "../../../shared/middleware/validator";
import { loginController, registerController } from "./controller";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login",validate(loginSchema),loginController);

export default router;