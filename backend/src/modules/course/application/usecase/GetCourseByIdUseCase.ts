import { CourseRepository } from "../../domain/repositories/CourseRepository";

export class GetCourseByIdUseCase {
  constructor(private courseRepository: CourseRepository) {}

  async execute(id: string) {
    return await this.courseRepository.getCourseById(id);
  }
}
