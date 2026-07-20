import { ExamAttempt, User } from "../entities/User";
import { RegisterDTO } from "../../../auth/application/dto/RegisterDTO";

export interface UserRepository{
    
    create(data: RegisterDTO):Promise<User>;

    findByEmail(email:string):Promise<User|null>;

    findById(id: string): Promise<User | null>;

    findByIdWithPassword(id: string): Promise<User | null>;

    update(id: string, data: Partial<User>): Promise<User>;

    saveExamAttempt(id: string, attempt: ExamAttempt): Promise<User>;

    delete(id: string): Promise<void>;

    findAll():Promise<User[]>;

    hasPurchasedCourse(courseId: string): Promise<boolean>;

    removeCourseFromWishlists(courseId: string): Promise<void>;

}
