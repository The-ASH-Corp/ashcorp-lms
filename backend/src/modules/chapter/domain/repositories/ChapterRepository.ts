import { ChapterRequestDTO } from "../../application/dto/ChapterDTO";
import { Chapter } from "../entities/Chapter";

export interface ChapterRepository{

    createChapter(data:ChapterRequestDTO):Promise<Chapter>

    getChaptersByCourseId(courseId:string):Promise<Chapter[]|null>
}