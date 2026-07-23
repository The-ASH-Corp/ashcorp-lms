import { Exam, ExamResponseDTO } from "../../domain/entities/Exam";
import { ExamRepository } from "../../domain/repositories/ExamRepository";
import { ExamModel } from "../models/ExamModel";

export class MongoExamRepository implements ExamRepository {
  async createExam(data: Exam): Promise<Exam> {
    return await ExamModel.create(data);
  }

  async findById(_id: string): Promise<Exam | null> {
    const exam = await ExamModel.findById(_id);
    return exam;
  }

  async updateExam(id: string, data: Exam): Promise<Exam | null> {
    return await ExamModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteExamById(examId: string): Promise<void> {
    await ExamModel.findByIdAndDelete(examId);
  }

  async getExamByCourse(courseId: string): Promise<ExamResponseDTO[]> {
    return await ExamModel.find({ courseId });
  }
}