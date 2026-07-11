import { NextFunction, Request, Response } from "express";
import { getChaptersByCourseIdUseCase, createChapterUseCase } from "../di";

export const getChapterByCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {id}=req.params
    const chapters=await getChaptersByCourseIdUseCase.execute(id as string)

    res.status(200).json({
        status:200,
        message:"Chapters fetched successfully",
        data:chapters
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

