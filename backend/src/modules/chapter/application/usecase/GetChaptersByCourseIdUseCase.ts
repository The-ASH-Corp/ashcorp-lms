import { Chapter } from "../../domain/entities/Chapter";
import { ChapterRepository } from "../../domain/repositories/ChapterRepository";

export class GetChaptersByCourseIdUseCase {
  constructor(private readonly chapterRepository: ChapterRepository) { }

  async execute(courseId: string, options?: { page?: number; limit?: number; searchTerm?: string }): Promise<Chapter[] | { chapters: Chapter[]; totalChapters: number } | null> {
    if (options?.page && options?.limit) {
      return await this.chapterRepository.getPaginatedChaptersByCourseId(
        courseId,
        options.page,
        options.limit,
        options.searchTerm,
      );
    }

    return await this.chapterRepository.getChaptersByCourseId(courseId)
  }
}
