import { Router } from "express";
import { createCourseController, getAllCourseController } from "./controller";


const router = Router();

router.post("/create",createCourseController)

router.get("/all-course",getAllCourseController);


export default router;