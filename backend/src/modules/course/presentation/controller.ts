import { NextFunction, Request, Response } from "express";
import { courseFindAllUseCase, createCourseUseCase, getCourseByIdUseCase } from "../di";
import { CourseRequestDTO } from "../application/dto/CourseDTO";
import { AppError } from "../../../shared/error/AppError";
import { getUploadPath } from "../../../shared/config/imageNameShortner";
import { serializeCourse } from "../../../shared/config/serializeCourses";

type UploadedFile = { path: string };
type UploadedFileMap = {
  thumbnail?: UploadedFile[];
  introVideo?: UploadedFile[];
};

export const getAllCourseController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const courses = await courseFindAllUseCase.execute();
    const serializedCourses = await Promise.all(courses.map(serializeCourse));

    res.status(200).json({
      success: true,
      data: serializedCourses,
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
    const files = (req as Request & { files?: UploadedFileMap }).files;
    const thumbnailPath = `/uploads/images/${files?.thumbnail?.[0]?.path}`;

    const videoPath = files?.introVideo?.[0]?.path;

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
    const serializedCourse = await serializeCourse(course);

    res.status(201).json({
      success: true,
      data: serializedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const course = await getCourseByIdUseCase.execute(id);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const serializedCourse = await serializeCourse(course);

    res.status(200).json({
      success: true,
      data: serializedCourse,
    });
  } catch (error) {
    next(error);
  }
};
