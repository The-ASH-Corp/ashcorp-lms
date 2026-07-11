import { GetChaptersByCourseIdUseCase } from "./application/usecase/GetChaptersByCourseIdUseCase";
import { MongoChapterRepository } from "./infrastructure/repositories/MongoChapterRepository";
import { CreateChapterUseCase } from "./application/usecase/CreateChapterUseCase";


const chapterRepository = new MongoChapterRepository();

export const getChaptersByCourseIdUseCase = new GetChaptersByCourseIdUseCase(chapterRepository)
export const createChapterUseCase = new CreateChapterUseCase(chapterRepository)