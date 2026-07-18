import { Exam, ExamResponseDTO } from "../entities/Exam";

export interface ExamRepository {
  createExam(data: Exam): Promise<Exam>;
  findById(id: string): Promise<Exam | null>;
  updateExam(id: string, data: Exam): Promise<Exam | null>;
  deleteExam(id: string): Promise<void>;
  toggleStatus(id: string): Promise<Exam | null>;
  getAllExams(): Promise<ExamResponseDTO[]>;
}