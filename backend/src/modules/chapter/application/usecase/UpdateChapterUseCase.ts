import { ChapterRequestDTO, Contents } from "../dto/ChapterDTO";
import { Chapter } from "../../domain/entities/Chapter";
import { ChapterRepository } from "../../domain/repositories/ChapterRepository";
import { AppError } from "../../../../shared/error/AppError";
import { uploadToS3 } from "../../../../shared/middleware/s3Uplosd";

export class UpdateChapterUseCase {
  constructor(private readonly chapterRepository: ChapterRepository) {}

  async execute(
    id: string,
    data: Partial<ChapterRequestDTO> & { contents?: Array<Record<string, unknown>> },
    files: Express.Multer.File[] = [],
  ): Promise<Chapter> {
    if (!id || typeof id !== "string") {
      throw new AppError("chapter id is required", 400);
    }

    if (!data || typeof data !== "object") {
      throw new AppError("Invalid request body", 400);
    }

    const existingChapter = await this.chapterRepository.findById(id);

    if (!existingChapter) {
      throw new AppError("Chapter not found", 404);
    }

    const nextCourseId = data.courseId ?? existingChapter.courseId;
    const nextTitle = data.title ?? existingChapter.title;
    const nextSerialNumber = data.serialNumber ?? existingChapter.serialNumber;

    if (!nextCourseId || typeof nextCourseId !== "string") {
      throw new AppError("courseId is required and must be a string", 400);
    }

    if (!nextTitle || typeof nextTitle !== "string") {
      throw new AppError("title is required and must be a string", 400);
    }

    if (nextSerialNumber === undefined || Number.isNaN(Number(nextSerialNumber))) {
      throw new AppError("serialNumber is required and must be a number", 400);
    }

    let resolvedContents: Contents[] | undefined;

    if (data.contents !== undefined) {
      if (!Array.isArray(data.contents) || data.contents.length === 0) {
        throw new AppError("contents must be a non-empty array", 400);
      }

      let fileIndex = 0;
      const mappedContents: Contents[] = await Promise.all(
        data.contents.map(async (content, index) => {
          const nextContent = { ...content } as Record<string, unknown>;

          if (nextContent.uploadType !== "file") {
            return {
              contentTitle: typeof nextContent.contentTitle === "string" ? nextContent.contentTitle : "",
              sequance: Number(nextContent.sequance ?? 0),
              contentUrl: typeof nextContent.contentUrl === "string" ? nextContent.contentUrl : "",
              isFree: Boolean(nextContent.isFree),
              duration:
                nextContent.duration === undefined || nextContent.duration === null
                  ? null
                  : Number(nextContent.duration),
            } as Contents;
          }

          const shouldUpload = Boolean(nextContent.hasNewFile);

          if (!shouldUpload) {
            return {
              contentTitle: typeof nextContent.contentTitle === "string" ? nextContent.contentTitle : "",
              sequance: Number(nextContent.sequance ?? 0),
              contentUrl: typeof nextContent.contentUrl === "string" ? nextContent.contentUrl : "",
              isFree: Boolean(nextContent.isFree),
              duration:
                nextContent.duration === undefined || nextContent.duration === null
                  ? null
                  : Number(nextContent.duration),
            } as Contents;
          }

          const file = files[fileIndex];
          fileIndex += 1;

          if (!file) {
            throw new AppError(
              `File is required for contents[${index}].contentUrl`,
              400,
            );
          }

          const upload = await uploadToS3(file, [nextCourseId, nextTitle]);
          return {
            contentTitle: typeof nextContent.contentTitle === "string" ? nextContent.contentTitle : "",
            sequance: Number(nextContent.sequance ?? 0),
            contentUrl: upload.url,
            isFree: Boolean(nextContent.isFree),
            duration:
              nextContent.duration === undefined || nextContent.duration === null
                ? null
                : Number(nextContent.duration),
          } as Contents;
        }),
      );

      resolvedContents = mappedContents;

      if (resolvedContents) {
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
            c.duration === undefined || c.duration === null
              ? null
              : Number(c.duration);

          if (c.duration !== null && Number.isNaN(c.duration)) {
            throw new AppError(`contents[${i}].duration must be a number`, 400);
          }
        }
      }
    }

    const updatedChapter = await this.chapterRepository.updateChapter(id, {
      courseId: nextCourseId,
      title: nextTitle,
      description: data.description ?? existingChapter.description,
      videoUrl: data.videoUrl ?? existingChapter.videoUrl,
      serialNumber: Number(nextSerialNumber),
      contents: resolvedContents ?? existingChapter.contents,
    });

    if (!updatedChapter) {
      throw new AppError("Chapter not found", 404);
    }

    return updatedChapter;
  }
}
