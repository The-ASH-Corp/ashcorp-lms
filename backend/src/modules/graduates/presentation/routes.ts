import { Router } from "express";
import {
  createGraduateController,
  deleteGraduateController,
  getAllGraduateWorks,
  getFeaturedGraduatesController,
  getGraduateByIdController,
  toggleGraduateFeatureController,
  updateGraduateController,
  getPaginatedGraduatesController,
} from "./controller";
import { graduateImagesUpload } from "../../../shared/middleware/imageUpload";

const router = Router();

// create graduates card (with S3 image & company logo upload under 'graduates details')
router.post("/create", graduateImagesUpload(), createGraduateController);

// get all Graduates list
router.get("/get-all", getAllGraduateWorks);

// get paginated Graduates list
router.get("/paginate", getPaginatedGraduatesController);

// get featured graduates for landing page
router.get("/get-featured", getFeaturedGraduatesController);

// get single graduate by ID
router.get("/get-by-id/:id", getGraduateByIdController);

// toggle featured state on landing page
router.patch("/toggle-feature/:id", toggleGraduateFeatureController);

// update graduate card details (with S3 image & company logo upload under 'graduates details')
router.put("/:id", graduateImagesUpload(), updateGraduateController);

// delete graduate card
router.delete("/:id", deleteGraduateController);

export default router;
