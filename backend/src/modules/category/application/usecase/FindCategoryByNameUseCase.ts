import { AppError } from "../../../../shared/error/AppError";
import { Category } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";

export class FindCategoryByNameUseCase {
    constructor(private readonly categoryRepository: CategoryRepository) {}
    
    async execute(name: string): Promise<Category|null> {
        const category = await this.categoryRepository.findCategoryByName(name);

        if(!category){
            throw new AppError("Category not found",404);
        }
        return category;
    }
}