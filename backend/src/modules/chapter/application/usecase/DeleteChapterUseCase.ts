import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { ChapterRepository } from "../../domain/repositories/ChapterRepository";

export class DeleteChapterUseCase {
  constructor(
    private readonly chapterRepository: ChapterRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const chapter = await this.chapterRepository.findById(id);

    if (!chapter) {
      throw new AppError("Chapter not found", 404);
    }

    await this.chapterRepository.deleteChapter(id);
    await this.courseRepository.removeChapterFromCourse(chapter.courseId, id);
  }
}
