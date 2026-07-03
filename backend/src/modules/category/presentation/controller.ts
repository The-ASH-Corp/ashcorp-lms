import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/error/AppError";
import { createCategoryUseCase } from "../di";
import { CategoryRequestDTO } from "../application/dto/CategoryDTO";
import { Category } from "../domain/entities/Category";

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
    try {
        const body: CategoryRequestDTO = req.body;
        const iconUrl = req.file?.path;

        if (!body.categoryName || !body.color || !iconUrl) {
            throw new AppError("Category name, color and icon are required", 400);
        }

        const category = new Category(body.categoryName, body.color, iconUrl);
        const createdCategory = await createCategoryUseCase.execute(category);

        res.status(201).json({
            success: true,
            data: createdCategory,
        });



    }catch(error){
        next(error);
    }
}