import { Router } from "express";
import {
	changePasswordSchema,
	forgotPasswordRequestSchema,
	loginSchema,
	registerSchema,
	resetPasswordWithOtpSchema,
} from "./validators";
import { validate } from "../../../shared/middleware/validator";
import {
	getCurrentUserController,
	loginController,
	registerController,
	logoutController,
	changePasswordController,
	requestPasswordResetOtpController,
	resetPasswordWithOtpController,
} from "./controller";
import { authMiddleware } from "../../../shared/middleware/authMiddleware";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login",validate(loginSchema),loginController);
router.get("/me",authMiddleware, getCurrentUserController);
router.post("/logout",authMiddleware, logoutController);
router.post("/change-password",authMiddleware, validate(changePasswordSchema), changePasswordController);
router.post("/forgot-password/request-otp", validate(forgotPasswordRequestSchema), requestPasswordResetOtpController);
router.post("/forgot-password/reset", validate(resetPasswordWithOtpSchema), resetPasswordWithOtpController);

export default router;