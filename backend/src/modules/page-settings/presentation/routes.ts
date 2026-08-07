import { Router } from "express";
import {
  getHomepageSettings,
  updateHomepageSettings,
} from "./controller";

const router = Router();

router.get("/homepage", getHomepageSettings);
router.put("/homepage", updateHomepageSettings);

export default router;
