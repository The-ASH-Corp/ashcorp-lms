import { AppError } from "../../../../shared/error/AppError";
import { Course } from "../../../course/domain/entities/Course";
import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export class GetWishlistUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly courseRepository: CourseRepository
    ) {}

    async execute(studentId: string): Promise<Course[]> {
        const user = await this.userRepository.findById(studentId);

        if (!user) {
            throw new AppError("Student not found", 404);
        }
        const wishlistCourses:Course[] = await Promise.all(user.wishlist.map((course:string)=>{
            return this.courseRepository.getCourseById(course);
        }))
        return wishlistCourses;
    }
}