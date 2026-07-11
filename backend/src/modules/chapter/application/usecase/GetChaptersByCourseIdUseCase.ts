import { Chapter } from "../../domain/entities/Chapter";
import { ChapterRepository } from "../../domain/repositories/ChapterRepository";

export class GetChaptersByCourseIdUseCase {
  constructor(private readonly chapterRepository: ChapterRepository) { }

  async execute(courseId: string): Promise<Chapter[] | null> {
    return await this.chapterRepository.getChaptersByCourseId(courseId)
  }
}