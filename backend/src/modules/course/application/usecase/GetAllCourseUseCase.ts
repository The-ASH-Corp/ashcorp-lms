import { Course } from "../../domain/entities/Course";
import { CourseRepository } from "../../domain/repositories/CourseRepository";

export class GetAllCourseUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(options?: { page?: number; limit?: number; searchTerm?: string }): Promise<Course[] | { courses: Course[]; totalCourses: number }> {
    if (options?.page && options?.limit) {
      return this.courseRepository.getPaginatedCourses(options.page, options.limit, options.searchTerm);
    }

    return this.courseRepository.getAllCourse();
  }
}
