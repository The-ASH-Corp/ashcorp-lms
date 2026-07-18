import { ExamRepository } from "../../domain/repositories/ExamRepository";

export class DeleteExamUseCase{
    constructor(private examRepository: ExamRepository){}

    async execute(examId: string): Promise<void> {
        const exam = await this.examRepository.findById(examId);

        if(!exam){
            throw new Error("Exam not found");
        }

        return await this.examRepository.deleteExamById(examId);
    }
}