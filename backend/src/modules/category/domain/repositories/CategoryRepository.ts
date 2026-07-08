import { Category, CategoryResponseDTO } from "../entities/Category";

export interface CategoryRepository {

    createCategory(data:Category):Promise<Category>;

    findCategoryByName(name:string):Promise<Category|null>;

    findById(id: string): Promise<Category | null>;

    getAllCategories():Promise<CategoryResponseDTO[]>;
    
}