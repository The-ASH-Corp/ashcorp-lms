import { ChapterRequestDTO } from "../../application/dto/ChapterDTO";
import { Chapter } from "../../domain/entities/Chapter";
import { ChapterRepository } from "../../domain/repositories/ChapterRepository";
import { ChapterModel } from "../models/ChapterModel";

export class MongoChapterRepository implements ChapterRepository {
  async createChapter(data: ChapterRequestDTO): Promise<Chapter> {
    const chapter = await ChapterModel.create(data);
    return chapter.toObject() as unknown as Chapter;
  }

  async getChaptersByCourseId(courseId: string): Promise<Chapter[] | null> {
    const chapters = await ChapterModel.find({ courseId });
    return chapters.map((chapter) => chapter.toObject() as unknown as Chapter);
  }

  async findById(id: string): Promise<Chapter | null> {
    const chapter = await ChapterModel.findById(id);
    return chapter ? (chapter.toObject() as unknown as Chapter) : null;
  }

  async deleteChapter(id: string): Promise<void> {
    await ChapterModel.findByIdAndDelete(id);
  }
}
