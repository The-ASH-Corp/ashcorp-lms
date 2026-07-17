import { NextFunction, Request, Response } from "express";
import {
  addToWishlistUseCase,
  blockStudentUseCase,
  createStudentUseCase,
  deleteStudentUseCase,
  enrollCourseUseCase,
  getAllStudentsUseCase,
  getMyCoursesUseCase,
  getWishlistUseCase,
  removeFromWishlistUseCase,
  updateCourseProgressUseCase,
} from "../di";
import { serializeCourse } from "../../../shared/config/serializeCourses";

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

export const enrollCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const studentId = String(req.userId);
    const { courseId } = req.body;
    const student = await enrollCourseUseCase.execute(studentId, String(courseId));

    res.status(200).json({
      success: true,
      message: "Course enrolled successfully",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const studentId = String(req.userId);
    const enrolledCourses = await getMyCoursesUseCase.execute(studentId);
    const data = await Promise.all(
      enrolledCourses.map(async (enrolledCourse) => ({
        ...(await serializeCourse(enrolledCourse.course)),
        progress: enrolledCourse.progress,
      })),
    );

    res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCourseProgressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const studentId = String(req.userId);
    const { courseId, progress } = req.body;
    const student = await updateCourseProgressUseCase.execute(
      studentId,
      String(courseId),
      Number(progress),
    );

    res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};
