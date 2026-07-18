import { Exam, ExamResponseDTO } from "../../domain/entities/Exam";
import { ExamRepository } from "../../domain/repositories/ExamRepository";
import { ExamModel } from "../models/ExamModel";

export class MongoExamRepository implements ExamRepository {
  async createExam(data: Exam): Promise<Exam> {
    return await ExamModel.create(data);
  }

  async findById(_id: string): Promise<Exam | null> {
    throw new Error("Method not implemented.");
  }

  async updateExam(_id: string, _data: Exam): Promise<Exam | null> {
    throw new Error("Method not implemented.");
  }

  async deleteExam(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async toggleStatus(_id: string): Promise<Exam | null> {
    throw new Error("Method not implemented.");
  }

  async getAllExams(): Promise<ExamResponseDTO[]> {
    throw new Error("Method not implemented.");
  }
}