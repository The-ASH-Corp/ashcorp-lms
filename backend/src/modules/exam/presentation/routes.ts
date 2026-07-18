import { Router } from "express";
import { createExamController } from "./controller";

const router = Router();

router.post("/create-exam",createExamController)

export default router;