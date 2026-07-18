import { AppError } from "../../../../shared/error/AppError";
import { Exam } from "../../domain/entities/Exam";
import { ExamRepository } from "../../domain/repositories/ExamRepository";

export class CreateExamUseCase {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute(exam: Exam): Promise<Exam> {
    if (!exam.courseId || !exam.courseId.trim()) {
      throw new AppError("Course is required", 400);
    }

    if (!exam.title || !exam.title.trim()) {
      throw new AppError("Exam title is required", 400);
    }

    if (!Number.isFinite(exam.duration) || exam.duration <= 0) {
      throw new AppError("Duration must be a positive number", 400);
    }

    if (!Number.isFinite(exam.marksPerQuestion) || exam.marksPerQuestion <= 0) {
      throw new AppError("Marks per question must be a positive number", 400);
    }

    if (!Number.isFinite(exam.passMarks) || exam.passMarks <= 0) {
      throw new AppError("Pass marks must be a positive number", 400);
    }

    if (!exam.questions || exam.questions.length === 0) {
      throw new AppError("At least one question is required", 400);
    }

    for (let i = 0; i < exam.questions.length; i++) {
      const question = exam.questions[i];

      if (!question.title || !question.title.trim()) {
        throw new AppError(`Question ${i + 1} must have a title`, 400);
      }

      if (question.type !== "multiple-choice" && question.type !== "true-false") {
        throw new AppError(`Question ${i + 1} has an invalid type`, 400);
      }

      if (!question.options || question.options.length < 2) {
        throw new AppError(`Question ${i + 1} must have at least 2 options`, 400);
      }

      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].text || !question.options[j].text.trim()) {
          throw new AppError(
            `Question ${i + 1}, Option ${j + 1} must have text`,
            400,
          );
        }
      }

      const correctCount = question.options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        throw new AppError(
          `Question ${i + 1} must have exactly one correct answer`,
          400,
        );
      }
    }

    exam.title = exam.title.trim();

    return await this.examRepository.createExam(exam);
  }
}
