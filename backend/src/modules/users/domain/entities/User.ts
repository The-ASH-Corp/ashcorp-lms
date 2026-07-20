import mongoose from "mongoose";

export interface ExamAnswer {
    questionIndex: number;
    selectedOptionIndex: number;
    isCorrect: boolean;
}

export interface ExamAttempt {
    examId: string;
    courseId: string;
    answers: ExamAnswer[];
    score: number;
    totalMarks: number;
    passMarks: number;
    isPassed: boolean;
    status: "submitted" | "stopped";
    reason?: string | null;
    attemptedAt: Date;
}

export class User{
    constructor(
        public name:string,
        public phone:number,
        public email:string,
        public password:string,
        public role:string,
        public status:string = "Active",
        public wishlist:string[] = [],
        public purchasedCourses:string[] = [],
        public courseProgress: Record<string, number> | Map<string, number> = {},
        public certificates:string[] = [],
        public examAttempts: ExamAttempt[] = [],
        public _id?: mongoose.Types.ObjectId |string,
    ){}
}
