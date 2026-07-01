import { Course } from "../../domain/entities/Course";
import { CourseRepository } from "../../domain/repositories/CourseRepository";

export class GetAllCourseUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(): Promise<Course[]> {
    return this.courseRepository.getAllCourse();
  }
}
