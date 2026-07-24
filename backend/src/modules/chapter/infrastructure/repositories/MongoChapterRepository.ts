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

  async getPaginatedChaptersByCourseId(courseId: string, page: number, limit: number, searchTerm?: string): Promise<{ chapters: Chapter[]; totalChapters: number; }> {
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.max(1, Math.floor(limit));
    const skip = (safePage - 1) * safeLimit;
    const trimmedSearchTerm = searchTerm?.trim();

    let searchFilter: Record<string, unknown> = { courseId };

    if (trimmedSearchTerm) {
      const escapedSearchTerm = trimmedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const orConditions: Array<Record<string, unknown>> = [
        { title: { $regex: escapedSearchTerm, $options: "i" } },
        { "contents.contentTitle": { $regex: escapedSearchTerm, $options: "i" } },
      ];

      const searchNum = Number(trimmedSearchTerm);
      if (!Number.isNaN(searchNum)) {
        orConditions.push({ serialNumber: searchNum });
      }

      searchFilter = {
        courseId,
        $or: orConditions,
      };
    }

    const [chapters, totalChapters] = await Promise.all([
      ChapterModel.find(searchFilter).sort({ serialNumber: 1, createdAt: -1 }).skip(skip).limit(safeLimit),
      ChapterModel.countDocuments(searchFilter),
    ]);

    return {
      chapters: chapters.map((chapter) => chapter.toObject() as unknown as Chapter),
      totalChapters,
    };
  }

  async findById(id: string): Promise<Chapter | null> {
    const chapter = await ChapterModel.findById(id);
    return chapter ? (chapter.toObject() as unknown as Chapter) : null;
  }

  async deleteChapter(id: string): Promise<void> {
    await ChapterModel.findByIdAndDelete(id);
  }

  async updateChapter(id: string, data: Partial<ChapterRequestDTO>): Promise<Chapter | null> {
    const chapter = await ChapterModel.findByIdAndUpdate(id, data, { new: true });
    return chapter ? (chapter.toObject() as unknown as Chapter) : null;
  }
}
