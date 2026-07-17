import { NextFunction, Request, Response } from "express";
import {
  addToWishlistUseCase,
  blockStudentUseCase,
  createStudentUseCase,
  deleteStudentUseCase,
  getAllStudentsUseCase,
  getWishlistUseCase,
  removeFromWishlistUseCase,
} from "../di";
import { UserModel } from "../../users/infrastructure/models/UserModel";

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


export const addToWishlistController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const studentId = String(req.userId);
    const { courseId } = req.body;
    const wishlist = await addToWishlistUseCase.execute(studentId, courseId);

    res.status(200).json({
      success: true,
      message: "Course added to wishlist successfully",
      data: wishlist,
    });
  } catch (err) {
    next(err);
  }
};


export const removeFromWishlistController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const studentId = String(req.userId);
    const { courseId } = req.body;
    const wishlist = await removeFromWishlistUseCase.execute(studentId, courseId);

    res.status(200).json({
      success: true,
      message: "Course removed from wishlist successfully",
      data: wishlist,
    });
  } catch (err) {
    next(err);
  }
};


export const getWishlistController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const studentId = String(req.userId);
    const wishlist = await getWishlistUseCase.execute(studentId);

    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  courseId = req.params.id;
  
};
