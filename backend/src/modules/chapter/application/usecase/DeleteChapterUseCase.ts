import { AppError } from "../../../../shared/error/AppError";
import { ChapterRepository } from "../../domain/repositories/ChapterRepository";

export class DeleteChapterUseCase {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async execute(id: string): Promise<void> {
    const chapter = await this.chapterRepository.findById(id);

    if (!chapter) {
      throw new AppError("Chapter not found", 404);
    }

    await this.chapterRepository.deleteChapter(id);
  }
}
