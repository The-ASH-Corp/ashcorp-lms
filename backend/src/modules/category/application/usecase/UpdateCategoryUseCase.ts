import { AppError } from "../../../../shared/error/AppError";
import { Category } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";

export interface UpdateCategoryPayload {
  categoryName?: string;
  color?: string;
  iconUrl?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  status?: string;
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new AppError("Category not found", 404);
    }

    if (
      payload.categoryName &&
      payload.categoryName !== existingCategory.categoryName
    ) {
      const categoryWithSameName = await this.categoryRepository.findCategoryByName(
        payload.categoryName,
      );

      if (categoryWithSameName) {
        throw new AppError("Category already exists", 400);
      }
    }

    const updatePayload: Record<string, unknown> = {};

    if (payload.categoryName !== undefined) {
      updatePayload.categoryName = payload.categoryName;
    }

    if (payload.color !== undefined) {
      updatePayload.color = payload.color;
    }

    if (payload.iconUrl !== undefined) {
      updatePayload.iconUrl = payload.iconUrl;
    }

    if (payload.isFeatured !== undefined) {
      updatePayload.isFeatured = payload.isFeatured;
    }

    if (payload.isPublished !== undefined) {
      updatePayload.isPublished = payload.isPublished;
    }

    if (payload.status !== undefined) {
      updatePayload.status = payload.status;
    }

    if (Object.keys(updatePayload).length === 0) {
      return existingCategory;
    }

    return this.categoryRepository.updateCategory(id, updatePayload);
  }
}
