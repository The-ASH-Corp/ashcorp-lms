import { NextFunction, Request, Response } from "express";
import { createExamUseCase, deleteExamUseCase, getExamByCourseUseCase } from "../di";
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

export const getExamByCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { courseId } = req.params;

    const exams = await getExamByCourseUseCase.execute(courseId as string);
    
    res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { examId } = req.params;

    await deleteExamUseCase.execute(examId as string);

    res.status(200).json({
      success: true,
      data: "Exam deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};