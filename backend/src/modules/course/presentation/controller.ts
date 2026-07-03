import { NextFunction, Request, Response } from "express";
import { courseFindAllUseCase, createCourseUseCase } from "../di";
import { CourseRequestDTO } from "../application/dto/CourseDTO";

export const getAllCourseController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const courses = await courseFindAllUseCase.execute();

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const createCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const courseData: CourseRequestDTO = req.body;

    const course = await createCourseUseCase.execute(courseData);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};