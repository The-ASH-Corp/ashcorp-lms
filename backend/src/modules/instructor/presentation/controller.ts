import { NextFunction, Request, Response } from "express";
import { createInstructorUseCase, getAllInstructorsUseCase } from "../di";

export const createInstructorController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const image = req.file?.path;

    const instructor = await createInstructorUseCase.execute(req.body,image);

    res.status(201).json({
      status: 201,
      message: "Instructor created successfully",
      data: instructor,
    });
  } catch (err) {
    next(err);
  }
};


export const getAllInstructorsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const instructors = await getAllInstructorsUseCase.execute()

    res.status(200).json({
      status: 200,
      message: "Instructors fetched successfully",
      data: instructors,
    });
  } catch (err) {
    next(err);
  }
};