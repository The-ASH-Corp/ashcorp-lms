import { CategoryRepository } from "../../domain/repositories/CategoryRepository";
import { CategoryResponseDTO } from "../dto/CategoryDTO";

export class GetAllCategoriesUseCase {
    constructor(private readonly categoryRepository: CategoryRepository) {}
    
    async execute(options?: { page?: number; limit?: number; searchTerm?: string }): Promise<CategoryResponseDTO[] | { categories: CategoryResponseDTO[]; totalCategories: number }> {
        if (options?.page && options?.limit) {
            return this.categoryRepository.getPaginatedCategories(options.page, options.limit, options.searchTerm);
        }

        const categories = await this.categoryRepository.getAllCategories();
        return categories;
    }
}