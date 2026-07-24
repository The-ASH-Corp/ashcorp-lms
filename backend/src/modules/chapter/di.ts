import { GetChaptersByCourseIdUseCase } from "./application/usecase/GetChaptersByCourseIdUseCase";
import { MongoChapterRepository } from "./infrastructure/repositories/MongoChapterRepository";
import { CreateChapterUseCase } from "./application/usecase/CreateChapterUseCase";
import { DeleteChapterUseCase } from "./application/usecase/DeleteChapterUseCase";
import { UpdateChapterUseCase } from "./application/usecase/UpdateChapterUseCase";
import { courseRepository } from "../course/di";


const chapterRepository = new MongoChapterRepository();

export const getChaptersByCourseIdUseCase = new GetChaptersByCourseIdUseCase(chapterRepository)
export const createChapterUseCase = new CreateChapterUseCase(chapterRepository, courseRepository)
export const deleteChapterUseCase = new DeleteChapterUseCase(chapterRepository, courseRepository)
export const updateChapterUseCase = new UpdateChapterUseCase(chapterRepository)
