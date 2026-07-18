import { Exam, ExamResponseDTO } from "../entities/Exam";

export interface ExamRepository {

  createExam(data: Exam): Promise<Exam>;

  findById(id: string): Promise<Exam | null>;

  updateExam(id: string, data: Exam): Promise<Exam | null>;

  getExamByCourse(courseId: string): Promise<ExamResponseDTO[]>;

  deleteExamById(examId: string): Promise<void>;
}