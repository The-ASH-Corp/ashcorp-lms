import { Course } from "../../domain/entities/Course";
import { CourseRepository } from "../../domain/repositories/CourseRepository";

export class CreateCourseUseCase {
    constructor(private readonly courseRepository: CourseRepository) {}

    async execute(courseData: Course): Promise<Course> {
        return this.courseRepository.create(courseData);
    }
}