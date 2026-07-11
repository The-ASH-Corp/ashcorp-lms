import { GetChaptersByCourseIdUseCase } from "./application/usecase/GetChaptersByCourseIdUseCase";
import { MongoChapterRepository } from "./infrastructure/repositories/MongoChapterRepository";
import { CreateChapterUseCase } from "./application/usecase/CreateChapterUseCase";
import { DeleteChapterUseCase } from "./application/usecase/DeleteChapterUseCase";


const chapterRepository = new MongoChapterRepository();

export const getChaptersByCourseIdUseCase = new GetChaptersByCourseIdUseCase(chapterRepository)
export const createChapterUseCase = new CreateChapterUseCase(chapterRepository)
export const deleteChapterUseCase = new DeleteChapterUseCase(chapterRepository)
