import { Category, CategoryResponseDTO } from "../../domain/entities/Category";
import { CategoryRepository } from "../../domain/repositories/CategoryRepository";
import { CategoryModel } from "../models/CategoryModel";
import { CourseModel } from "../../../course/infrastructure/models/CourseModel";

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

    async findById(id: string): Promise<Category | null> {
        const category = await CategoryModel.findById(id);
        return category;
    }

    async updateCategory(id: string, data: Record<string, unknown>): Promise<Category> {
        const category = await CategoryModel.findByIdAndUpdate(id, data, { new: true });

        if (!category) {
            throw new Error("Category not found");
        }

        return category;
    }

    async hasCourses(id: string): Promise<boolean> {
        const courseCount = await CourseModel.countDocuments({ category: id });
        return courseCount > 0;
    }

    async deleteCategory(id: string): Promise<void> {
        await CategoryModel.findByIdAndDelete(id);
    }

    async getAllCategories(): Promise<CategoryResponseDTO[]> {
        const categories = await CategoryModel.find().sort({createdAt: -1});
        return categories;
    }
}
