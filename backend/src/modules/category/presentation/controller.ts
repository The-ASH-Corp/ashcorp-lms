import { NextFunction, Request, Response } from "express";
import { createCategoryUseCase } from "../di";
import { CategoryRequestDTO } from "../application/dto/CategoryDTO";
import { Category } from "../domain/entities/Category";
import { AppError } from "../../../shared/error/AppError";
import { getUploadPath } from "../../../shared/config/imageNameShortner";

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body: CategoryRequestDTO = req.body;
    const iconUrl = req.file?.path;

    if (!iconUrl) {
      throw new AppError("Icon is required", 400);
    }
    const category = new Category(
      body.categoryName,
      body.color,
      getUploadPath(iconUrl),
      body.isFeatured,
    );

    const createdCategory = await createCategoryUseCase.execute(category);

    res.status(201).json({
      success: true,
      data: createdCategory,
    });
  } catch (error) {
    next(error);
  }
};
