import { NextFunction, Request, Response } from "express";
import {
  getChaptersByCourseIdUseCase,
  createChapterUseCase,
  deleteChapterUseCase,
  updateChapterUseCase,
} from "../di";

type UploadedFileMap = {
  files?: Express.Multer.File[];
};

export const getChapterByCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? 0);
    const searchTerm = typeof req.query.search === "string" ? req.query.search : undefined;

    if (page > 0 && limit > 0) {
      const result = await getChaptersByCourseIdUseCase.execute(id, { page, limit, searchTerm });

      if (result && !Array.isArray(result)) {
        res.status(200).json({
          status: 200,
          message: "Chapters fetched successfully",
          data: result.chapters,
          pagination: {
            totalChapters: result.totalChapters,
            totalPages: Math.max(1, Math.ceil(result.totalChapters / limit)),
            currentPage: page,
            limit,
          },
        });
        return;
      }
    }

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
    const body = {
      ...req.body,
      contents:
        typeof req.body.contents === "string"
          ? JSON.parse(req.body.contents)
          : req.body.contents,
    };
    const files = (req as Request & { files?: UploadedFileMap }).files?.files ?? [];

    const created = await createChapterUseCase.execute(body, files);

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

export const updateChapterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const body = {
      ...req.body,
      contents:
        typeof req.body.contents === "string"
          ? JSON.parse(req.body.contents)
          : req.body.contents,
    };
    const files = (req as Request & { files?: UploadedFileMap }).files?.files ?? [];

    const updated = await updateChapterUseCase.execute(id, body, files);

    res.status(200).json({
      status: 200,
      message: "Chapter updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
