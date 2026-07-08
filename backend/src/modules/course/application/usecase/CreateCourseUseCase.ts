import { Course } from "../../domain/entities/Course";
import { CourseRepository } from "../../domain/repositories/CourseRepository";
import { CourseRequestDTO } from "../dto/CourseDTO";
import { AppError } from "../../../../shared/error/AppError";
import { CategoryRepository } from "../../../category/domain/repositories/CategoryRepository";
import { InstructorRepository } from "../../../instructor/domain/repositories/InstructorRepository";
import { isValidObjectId } from "mongoose";

export class CreateCourseUseCase {
    constructor(
        private readonly courseRepository: CourseRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly instructorRepository: InstructorRepository,
    ) {}

    async execute(courseData: CourseRequestDTO): Promise<Course> {
        if (!isValidObjectId(courseData.category) || !isValidObjectId(courseData.instructor)) {
            throw new AppError("Category and instructor must be valid document IDs", 400);
        }

        const [category, instructor] = await Promise.all([
            this.categoryRepository.findById(courseData.category),
            this.instructorRepository.findById(courseData.instructor),
        ]);

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        if (!instructor) {
            throw new AppError("Instructor not found", 404);
        }

        const course = new Course(
            courseData.title,
            courseData.description,
            courseData.price,
            courseData.offerPrice,
            courseData.instructor,
            courseData.category,
            courseData.imageUrl,
            courseData.videoUrl,
            new Date(),
            new Date(),
        );

        return this.courseRepository.create(course);
    }
}