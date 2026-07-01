import { Router } from "express";
import { getAllCourseController } from "./controller";


const router = Router();

// router.post("/create",create)
router.get("/all-course",getAllCourseController);


export default router;