import { Router } from "express";
import { loginSchema, registerSchema } from "./validators";
import { validate } from "../../../shared/middleware/validator";
import { getCurrentUserController, loginController, registerController, logoutController, changePasswordController } from "./controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login",validate(loginSchema),loginController);
router.get("/me",authMiddleware, getCurrentUserController);
router.post("/logout",authMiddleware, logoutController);
router.post("/change-password",authMiddleware, changePasswordController);

export default router;