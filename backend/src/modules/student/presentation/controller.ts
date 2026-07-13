import { NextFunction, Request, Response } from "express";
import {
  blockStudentUseCase,
  createStudentUseCase,
  deleteStudentUseCase,
  getAllStudentsUseCase,
} from "../di";

export const createStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const student = await createStudentUseCase.execute(req.body);

    res.status(201).json({
      status: 201,
      message: "Student created successfully",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllStudentsController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const students = await getAllStudentsUseCase.execute();

    res.status(200).json({
      status: 200,
      message: "Students fetched successfully",
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteStudentUseCase.execute(id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const blockStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const student = await blockStudentUseCase.execute(id);

    res.status(200).json({
      success: true,
      message:
        student.status === "Inactive"
          ? "Student blocked successfully"
          : "Student unblocked successfully",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};
