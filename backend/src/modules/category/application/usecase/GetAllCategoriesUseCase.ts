import { CategoryRepository } from "../../domain/repositories/CategoryRepository";
import { CategoryResponseDTO } from "../dto/CategoryDTO";

export class GetAllCategoriesUseCase {
    constructor(private readonly categoryRepository: CategoryRepository) {}
    
    async execute(): Promise<CategoryResponseDTO[]> {
        const categories = await this.categoryRepository.getAllCategories();
        return categories;
    }
}