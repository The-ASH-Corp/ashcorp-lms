import { NextFunction, Request, Response } from "express";
import { courseFindAllUseCase } from "../di";

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
