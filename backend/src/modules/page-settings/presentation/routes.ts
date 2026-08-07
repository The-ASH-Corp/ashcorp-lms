import { Router } from "express";
import {
  getHomepageSettings,
  updateHomepageSettings,
  getAboutSettings,
  updateAboutSettings,
  getContactSettings,
  updateContactSettings,
  getPrivacyPolicySettings,
  updatePrivacyPolicySettings,
} from "./controller";

const router = Router();

router.get("/homepage", getHomepageSettings);
router.put("/homepage", updateHomepageSettings);

router.get("/about", getAboutSettings);
router.put("/about", updateAboutSettings);

router.get("/contact", getContactSettings);
router.put("/contact", updateContactSettings);

router.get("/privacy-policy", getPrivacyPolicySettings);
router.put("/privacy-policy", updatePrivacyPolicySettings);

export default router;
