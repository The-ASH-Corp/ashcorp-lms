import { AppError } from "../../../../shared/error/AppError";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    await this.categoryRepository.deleteCategory(id);
  }
}
