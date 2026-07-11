import { ChapterRequestDTO } from "../../application/dto/ChapterDTO";
import { Chapter } from "../../domain/entities/Chapter";
import { ChapterRepository } from "../../domain/repositories/ChapterRepository";
import { ChapterModel } from "../models/ChapterModel";

export class MongoChapterRepository implements ChapterRepository {
  async createChapter(data: ChapterRequestDTO): Promise<Chapter> {
    return await ChapterModel.create(data);
  }

  async getChaptersByCourseId(courseId: string): Promise<Chapter[] | null> {
    return await ChapterModel.find({ courseId });
  }
}