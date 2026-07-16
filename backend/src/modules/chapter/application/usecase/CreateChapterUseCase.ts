import { ChapterRequestDTO } from "../dto/ChapterDTO";
import { Chapter } from "../../domain/entities/Chapter";
import { ChapterRepository } from "../../domain/repositories/ChapterRepository";
import { AppError } from "../../../../shared/error/AppError";
import { CourseRepository } from "../../../course/domain/repositories/CourseRepository";
import { uploadToS3 } from "../../../../shared/middleware/s3Uplosd";

export class CreateChapterUseCase {
  constructor(
    private readonly chapterRepository: ChapterRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(
    data: ChapterRequestDTO & { contents?: any[] },
    files: Express.Multer.File[] = [],
  ): Promise<Chapter> {

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

    const course = await this.courseRepository.getCourseById(courseId);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    let fileIndex = 0;
    const resolvedContents = await Promise.all(
      contents.map(async (content, index) => {
        if (content.uploadType !== "file") {
          return content;
        }

        const file = files[fileIndex];
        fileIndex += 1;

        if (!file) {
          throw new AppError(
            `File is required for contents[${index}].contentUrl`,
            400,
          );
        }

        const upload = await uploadToS3(file, [course.title, title]);

        return {
          ...content,
          contentUrl: upload.url,
        };
      }),
    );

    for (const [i, c] of resolvedContents.entries()) {
      if (!c || typeof c.contentTitle !== "string" || !c.contentTitle.trim()) {
        throw new AppError(`contents[${i}].contentTitle is required`, 400);
      }
      if (c.sequance === undefined || Number.isNaN(Number(c.sequance))) {
        throw new AppError(`contents[${i}].sequance must be a number`, 400);
      }
      if (!c.contentUrl || typeof c.contentUrl !== "string") {
        throw new AppError(`contents[${i}].contentUrl is required`, 400);
      }
      c.isFree = Boolean(c.isFree);
      c.duration =
        c.duration === undefined || c.duration === null || c.duration === ""
          ? null
          : Number(c.duration);

      if (c.duration !== null && Number.isNaN(c.duration)) {
        throw new AppError(`contents[${i}].duration must be a number`, 400);
      }
    }

    return await this.chapterRepository.createChapter({
      ...data,
      contents: resolvedContents,
    });
  }
}
