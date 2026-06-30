import { Router } from "express";
import { loginSchema, registerSchema } from "./validators";
import { validate } from "../../../shared/middleware/validator";
import { getCurrentUserController, loginController, registerController, logoutController } from "./controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login",validate(loginSchema),loginController);
router.get("/me",authMiddleware, getCurrentUserController);
router.post("/logout",authMiddleware, logoutController);

export default router;