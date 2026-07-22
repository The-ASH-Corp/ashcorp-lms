import { CourseRepository } from "../../domain/repositories/CourseRepository";

export class AddReviewUseCase {
  constructor(private courseRepository: CourseRepository) {}

  async execute(
    courseId: string,
    userId: string,
    rating: number,
    review: string,
  ) {
    return this.courseRepository.addReview(courseId, userId, rating, review);
  }
}
