import { AppError } from "../../../../shared/error/AppError";
import { Exam } from "../../domain/entities/Exam";
import { ExamRepository } from "../../domain/repositories/ExamRepository";

export class GetExamByCourseUseCase {
    constructor(
        private readonly examRepository: ExamRepository
    ) { }
    
    async execute(courseId: string): Promise<Exam[]> {
        if (!courseId) {
            throw new AppError("Course ID is required", 400);
        }
        return await this.examRepository.getExamByCourse(courseId);
    }
}