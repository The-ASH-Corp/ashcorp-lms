import { NextFunction, Request, Response } from "express";
import {
  createCategoryUseCase,
  deleteCategoryUseCase,
  getAllCategoriesUseCase,
  updateCategoryUseCase,
} from "../di";
import { CategoryRequestDTO } from "../application/dto/CategoryDTO";
import { Category } from "../domain/entities/Category";
import { AppError } from "../../../shared/error/AppError";
import { uploadToS3 } from "../../../shared/middleware/s3Uplosd";

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

    const { url: iconUrl } = await uploadToS3(req.file, "categories");
  
    const category = new Category(
      body.categoryName,
      body.description,
      body.color,
      iconUrl,
      body.isFeatured,
      false,
      body.status,
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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? 0);
    const searchTerm = typeof req.query.search === "string" ? req.query.search : undefined;

    if (page > 0 && limit > 0) {
      const result = await getAllCategoriesUseCase.execute({ page, limit, searchTerm });

      if (!Array.isArray(result)) {
        res.status(200).json({
          success: true,
          data: result.categories,
          pagination: {
            totalCategories: result.totalCategories,
            totalPages: Math.max(1, Math.ceil(result.totalCategories / limit)),
            currentPage: page,
            limit,
          },
        });
        return;
      }
    }

    const categories = await getAllCategoriesUseCase.execute();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const body: CategoryRequestDTO = req.body;
    let iconUrl: string | undefined;

    if (req.file) {
      const uploadResult = await uploadToS3(req.file, "categories");
      iconUrl = uploadResult.url;
    }

    const updatedCategory = await updateCategoryUseCase.execute(id, {
      categoryName: body.categoryName,
      color: body.color,
      iconUrl,
      isFeatured: body.isFeatured,
      isPublished: body.isPublished,
      status: body.status,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
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
