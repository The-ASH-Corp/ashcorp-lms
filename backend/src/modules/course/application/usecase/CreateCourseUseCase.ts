import { Course } from "../../domain/entities/Course";
import { CourseRepository } from "../../domain/repositories/CourseRepository";
import { CourseRequestDTO } from "../dto/CourseDTO";

export class CreateCourseUseCase {
    constructor(private readonly courseRepository: CourseRepository) {}

    async execute(courseData: CourseRequestDTO): Promise<Course> {
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