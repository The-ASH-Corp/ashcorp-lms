import { Category, CategoryResponseDTO } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";
import { CategoryModel } from "../models/CategoryModel";

export class MongoCategoryRepository implements CategoryRepository {

    async createCategory(data:Category):Promise<Category>{
        const category = new CategoryModel(data);
        await category.save();
        return category;
    }

    async findCategoryByName(name: string): Promise<Category | null> {
        const category = await CategoryModel.findOne({ categoryName: name });
        return category;
    }

    async getAllCategories(): Promise<CategoryResponseDTO[]> {
        const categories = await CategoryModel.find({
            status: "Active"
        });
        return categories;
    }
}