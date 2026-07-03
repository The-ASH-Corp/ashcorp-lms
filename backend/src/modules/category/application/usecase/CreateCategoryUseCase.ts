import { AppError } from "../../../../shared/error/AppError";
import { Category } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";


export class CreateCategoryUseCase {
    constructor(private readonly categoryRepository: CategoryRepository) {}
    
    async execute(category: Category): Promise<Category> {

        if (!category.categoryName || !category.color || !category.iconUrl) {
          throw new AppError("Category name, color and icon are required", 400);
        }

        const existingCategory = await this.categoryRepository.findCategoryByName(category.categoryName);

        if(existingCategory){
            throw new AppError("Category already exists",400);
        }

        return await this.categoryRepository.createCategory(category);
    }
    
}