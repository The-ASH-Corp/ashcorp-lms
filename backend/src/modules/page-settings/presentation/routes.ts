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
  getTermsConditionsSettings,
  updateTermsConditionsSettings,
  uploadImageController,
} from "./controller";
import { localImageUpload } from "../../../shared/middleware/localImageUpload";

const router = Router();

router.get("/homepage", getHomepageSettings);
router.put("/homepage", updateHomepageSettings);

router.get("/about", getAboutSettings);
router.put("/about", updateAboutSettings);

router.get("/contact", getContactSettings);
router.put("/contact", updateContactSettings);

router.get("/privacy-policy", getPrivacyPolicySettings);
router.put("/privacy-policy", updatePrivacyPolicySettings);

router.get("/terms-conditions", getTermsConditionsSettings);
router.put("/terms-conditions", updateTermsConditionsSettings);

router.post("/upload-image", localImageUpload("image"), uploadImageController);

export default router;
