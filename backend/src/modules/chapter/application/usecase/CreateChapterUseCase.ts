import { ChapterRequestDTO } from "../dto/ChapterDTO";
import { Chapter } from "../../domain/entities/Chapter";
import { ChapterRepository } from "../../domain/repositories/ChapterRepository";
import { AppError } from "../../../../shared/error/AppError";

export class CreateChapterUseCase {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async execute(data: ChapterRequestDTO): Promise<Chapter> {

    if (!data || typeof data !== "object") {
      throw new AppError("Invalid request body", 400);
    }

    const { courseId, title, serialNumber, contents } = data as any;

    if (!courseId || typeof courseId !== "string") {
      throw new AppError("courseId is required and must be a string", 400);
    }

    if (!title || typeof title !== "string") {
      throw new AppError("title is required and must be a string", 400);
    }

    if (serialNumber === undefined || Number.isNaN(Number(serialNumber))) {
      throw new AppError("serialNumber is required and must be a number", 400);
    }

    if (!Array.isArray(contents) || contents.length === 0) {
      throw new AppError("contents must be a non-empty array", 400);
    }

    for (const [i, c] of contents.entries()) {
      if (!c || typeof c.contentTitle !== "string" || !c.contentTitle.trim()) {
        throw new AppError(`contents[${i}].contentTitle is required`, 400);
      }
      if (c.sequance === undefined || Number.isNaN(Number(c.sequance))) {
        throw new AppError(`contents[${i}].sequance must be a number`, 400);
      }
      if (!c.contentUrl || typeof c.contentUrl !== "string") {
        throw new AppError(`contents[${i}].contentUrl is required`, 400);
      }
    }

    return await this.chapterRepository.createChapter(data);
  }
}
