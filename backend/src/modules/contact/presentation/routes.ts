import { Router } from "express";
import { validate } from "../../../shared/middleware/validator";
import { submitInquirySchema } from "./validators";
import { submitInquiryController } from "./controller";

const router = Router();

router.post("/submit", validate(submitInquirySchema), submitInquiryController);

export default router;
