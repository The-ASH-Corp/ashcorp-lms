import { NextFunction, Request, Response } from "express";
import { createExamUseCase } from "../di";
import { Exam } from "../domain/entities/Exam";

export const createExamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { courseId, title, duration, marksPerQuestion, passMarks, questions } =
      req.body;

    const exam = new Exam(
      courseId,
      title,
      Number(duration),
      Number(marksPerQuestion),
      Number(passMarks),
      questions,
    );

    const createdExam = await createExamUseCase.execute(exam);

    res.status(201).json({
      success: true,
      data: createdExam,
    });
  } catch (error) {
    next(error);
  }
};
