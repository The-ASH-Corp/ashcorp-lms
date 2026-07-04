import { CreateCategoryUseCase } from "./application/usecase/CreateCategoryUseCase";
import { FindCategoryByNameUseCase } from "./application/usecase/FindCategoryByNameUseCase";
import { MongoCategoryRepository } from "./infrastructure/reposotories/MongoCategoryRepository";
import { GetAllCategoriesUseCase } from "./application/usecase/GetAllCategoriesUseCase";

export const categoryRepository = new MongoCategoryRepository();

// Create category UseCase
export const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

// find one category by name UseCase
export const findCategoryByNameUseCase = new FindCategoryByNameUseCase(categoryRepository);

// find all categories UseCase
export const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository);
