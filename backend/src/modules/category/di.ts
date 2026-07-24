import { CreateCategoryUseCase } from "./application/usecase/CreateCategoryUseCase";
import { DeleteCategoryUseCase } from "./application/usecase/DeleteCategoryUseCase";
import { FindCategoryByNameUseCase } from "./application/usecase/FindCategoryByNameUseCase";
import { MongoCategoryRepository } from "./infrastructure/repositories/MongoCategoryRepository";
import { GetAllCategoriesUseCase } from "./application/usecase/GetAllCategoriesUseCase";
import { UpdateCategoryUseCase } from "./application/usecase/UpdateCategoryUseCase";

export const categoryRepository = new MongoCategoryRepository();

// Create category UseCase
export const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

// find one category by name UseCase
export const findCategoryByNameUseCase = new FindCategoryByNameUseCase(categoryRepository);

// find all categories UseCase
export const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository);

// update category UseCase
export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);

// delete category UseCase
export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
