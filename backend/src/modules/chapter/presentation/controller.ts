import { NextFunction, Request, Response } from "express";
import {
  getChaptersByCourseIdUseCase,
  createChapterUseCase,
  deleteChapterUseCase,
} from "../di";

export const getChapterByCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const chapters = await getChaptersByCourseIdUseCase.execute(id);

    res.status(200).json({
      status: 200,
      message: "Chapters fetched successfully",
      data: chapters,
    })
  } catch (error) {
    next(error);
  }
};

export const createChapterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body;

    const created = await createChapterUseCase.execute(body);

    res.status(201).json({ status: 201, message: "Chapter created successfully", data: created });
  } catch (error) {
        next(error);
  }
};

export const deleteChapterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteChapterUseCase.execute(id);

    res.status(200).json({
      status: 200,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
