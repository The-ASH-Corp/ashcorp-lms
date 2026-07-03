import { Category } from "../entities/Category";

export interface CategoryRepository {

    createCategory(data:Category):Promise<Category>;

    findCategoryByName(name:string):Promise<Category|null>;
    
}