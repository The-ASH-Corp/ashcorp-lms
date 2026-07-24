import { ChapterRequestDTO } from "../../application/dto/ChapterDTO";
import { Chapter } from "../entities/Chapter";

export interface ChapterRepository{

    createChapter(data:ChapterRequestDTO):Promise<Chapter>

    getChaptersByCourseId(courseId:string):Promise<Chapter[]|null>

    getPaginatedChaptersByCourseId(courseId: string, page: number, limit: number, searchTerm?: string): Promise<{
        chapters: Chapter[];
        totalChapters: number;
    }>

    findById(id: string): Promise<Chapter | null>

    deleteChapter(id: string): Promise<void>

    updateChapter(id: string, data: Partial<ChapterRequestDTO>): Promise<Chapter | null>
}
