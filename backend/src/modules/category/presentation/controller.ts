import { NextFunction, Request, Response } from "express";
import {
  createCategoryUseCase,
  deleteCategoryUseCase,
  getAllCategoriesUseCase,
} from "../di";
import { CategoryRequestDTO } from "../application/dto/CategoryDTO";
import { Category } from "../domain/entities/Category";
import { AppError } from "../../../shared/error/AppError";

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body: CategoryRequestDTO = req.body;
    
    if (!req.file) {
      throw new AppError("Icon is required", 400);
    }

    const iconUrl = `/uploads/images/${req.file.filename}`;
  
    const category = new Category(
      body.categoryName,
      body.color,
      iconUrl,
      body.isFeatured,
      false,
      body.status
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

export const getAllCategoriesController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const categories = await getAllCategoriesUseCase.execute();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteCategoryUseCase.execute(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
