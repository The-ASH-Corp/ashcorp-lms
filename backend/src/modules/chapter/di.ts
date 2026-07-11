import { GetChaptersByCourseIdUseCase } from "./application/usecase/GetChaptersByCourseIdUseCase";
import { MongoChapterRepository } from "./infrastructure/repositories/MongoChapterRepository";


const chapterRepository = new MongoChapterRepository();

export const getChaptersByCourseIdUseCase = new GetChaptersByCourseIdUseCase(chapterRepository)