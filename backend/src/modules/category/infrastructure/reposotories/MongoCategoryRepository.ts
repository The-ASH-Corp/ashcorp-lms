import { Category } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";
import { CategoryModel } from "../models/CategoryModel";
import { CategoryResponseDTO } from "../../application/dto/CategoryDTO";

export class MongoCategoryRepository implements CategoryRepository {

    async createCategory(data:Category):Promise<CategoryResponseDTO>{
        const category = new CategoryModel(data);
        await category.save();
        return category;
    }

    async findCategoryByName(name: string): Promise<Category | null> {
        const category = await CategoryModel.findOne({ categoryName: name });
        return category;
    }
}