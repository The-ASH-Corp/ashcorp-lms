import { Router } from "express";
import {
  getHomepageSettings,
  updateHomepageSettings,
  getAboutSettings,
  updateAboutSettings,
  getContactSettings,
  updateContactSettings,
} from "./controller";

const router = Router();

router.get("/homepage", getHomepageSettings);
router.put("/homepage", updateHomepageSettings);

router.get("/about", getAboutSettings);
router.put("/about", updateAboutSettings);

router.get("/contact", getContactSettings);
router.put("/contact", updateContactSettings);

export default router;
