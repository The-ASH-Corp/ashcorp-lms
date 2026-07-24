import { NextFunction, Request, Response } from "express";
import {
  createExamUseCase,
  deleteExamUseCase,
  getExamByCourseUseCase,
  updateExamUseCase,
  uploadCertificateUseCase,
} from "../di";
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

export const updateExamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { examId } = req.params;
    const { courseId, title, duration, marksPerQuestion, passMarks, questions } = req.body;

    const exam = new Exam(
      courseId,
      title,
      Number(duration),
      Number(marksPerQuestion),
      Number(passMarks),
      questions,
    );

    const updatedExam = await updateExamUseCase.execute(examId as string, exam);

    res.status(200).json({
      success: true,
      data: updatedExam,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadCertificateController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filesObj = req.files as Record<string, Express.Multer.File[]> | undefined;
    const file =
      req.file ||
      filesObj?.file?.[0] ||
      filesObj?.certificate?.[0] ||
      filesObj?.image?.[0];

    const studentId = String(
      req.body.studentId || req.query.studentId || req.params.studentId || "",
    );
    const courseId = String(
      req.body.courseId || req.query.courseId || req.params.courseId || "",
    );

    const data = await uploadCertificateUseCase.execute({
      studentId,
      courseId,
      file: file!,
    });

    res.status(200).json({
      success: true,
      message: "Certificate uploaded successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};