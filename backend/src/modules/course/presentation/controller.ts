import { NextFunction, Request, Response } from "express";
import { courseFindAllUseCase, createCourseUseCase } from "../di";

export const getAllCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
) => {
  try {
    const courseData = req.body;

    const courses = await createCourseUseCase.execute(courseData);

    res.status(201).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};