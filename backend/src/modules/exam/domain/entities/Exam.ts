export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  type: "multiple-choice" | "true-false";
  title: string;
  options: QuestionOption[];
}

export interface ExamResponseDTO {
  id: string;
  courseId: string;
  title: string;
  duration: number;
  marksPerQuestion: number;
  passMarks: number;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export class Exam {
  constructor(
    public courseId: string,
    public title: string,
    public duration: number,
    public marksPerQuestion: number,
    public passMarks: number,
    public questions: Question[],
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}