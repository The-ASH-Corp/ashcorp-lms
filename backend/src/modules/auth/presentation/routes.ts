import { Router } from "express";
import { registerSchema } from "./validators";
import { validate } from "../../../shared/middleware/validator";
import { registerController } from "./controller";

const router = Router();

router.post("/register", validate(registerSchema), registerController);

export default router;