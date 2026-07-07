import { NextFunction, Request, Response } from "express";
import { courseFindAllUseCase, createCourseUseCase } from "../di";
import { CourseRequestDTO } from "../application/dto/CourseDTO";
import { AppError } from "../../../shared/error/AppError";
import { getUploadPath } from "../../../shared/config/imageNameShortner";

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
    const body = req.body as Record<string, unknown>;
    const thumbnailPath = (req.files as any)?.thumbnail?.[0]?.path as string | undefined;
    const videoPath = (req.files as any)?.introVideo?.[0]?.path as string | undefined;

    if (!thumbnailPath || !videoPath) {
      throw new AppError("Thumbnail and intro video are required", 400);
    }

    const courseData: CourseRequestDTO = {
      title: String(body.title ?? ""),
      description: String(body.description ?? ""),
      price: Number(body.price ?? 0),
      offerPrice: Number(body.offerPrice ?? 0),
      instructor: String(body.instructor ?? ""),
      category: String(body.category ?? ""),
      imageUrl: getUploadPath(thumbnailPath),
      videoUrl: getUploadPath(videoPath),
    };

    const course = await createCourseUseCase.execute(courseData);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};