import { Category, CategoryResponseDTO } from "../entities/Category";

export interface CategoryRepository {

    createCategory(data:Category):Promise<Category>;

    findCategoryByName(name:string):Promise<Category|null>;

    findById(id: string): Promise<Category | null>;

    updateCategory(id: string, data: Record<string, unknown>): Promise<Category>;

    hasCourses(id: string): Promise<boolean>;

    deleteCategory(id: string): Promise<void>;

    getAllCategories():Promise<CategoryResponseDTO[]>;
    
}
