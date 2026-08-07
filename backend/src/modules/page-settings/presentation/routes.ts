import { Router } from "express";
import {
  getHomepageSettings,
  updateHomepageSettings,
  getAboutSettings,
  updateAboutSettings,
} from "./controller";

const router = Router();

router.get("/homepage", getHomepageSettings);
router.put("/homepage", updateHomepageSettings);

router.get("/about", getAboutSettings);
router.put("/about", updateAboutSettings);

export default router;
