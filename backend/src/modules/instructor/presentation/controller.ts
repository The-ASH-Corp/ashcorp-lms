import { NextFunction, Request, Response } from "express";
import {
  blockInstructorUseCase,
  createInstructorUseCase,
  deleteInstructorUseCase,
  getAllInstructorsUseCase,
  getInstructorByIdUseCase,
  updateInstructorUseCase,
} from "../di";
import { uploadToS3 } from "../../../shared/middleware/s3Uplosd";

export const createInstructorController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    
    const image = req.file
      ? (await uploadToS3(req.file, "instructors")).url
      : undefined;
      

    const instructor = await createInstructorUseCase.execute(req.body,image);

    res.status(201).json({
      status: 201,
      message: "Instructor created successfully",
      data: instructor,
    });
  } catch (err) {
    next(err);
  }
};


export const getAllInstructorsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? 0);
    const searchTerm =
      typeof req.query.search === "string" ? req.query.search : undefined;

    if (Number.isFinite(page) && Number.isFinite(limit) && page > 0 && limit > 0) {
      const result = await getAllInstructorsUseCase.execute({
        page,
        limit,
        searchTerm,
      });

      if (result && !Array.isArray(result)) {
        res.status(200).json({
          status: 200,
          message: "Instructors fetched successfully",
          data: result.instructors,
          pagination: {
            totalInstructors: result.totalInstructors,
            totalPages: Math.max(1, Math.ceil(result.totalInstructors / limit)),
            currentPage: page,
            limit,
          },
        });
        return;
      }
    }

    const instructors = await getAllInstructorsUseCase.execute();

    res.status(200).json({
      status: 200,
      message: "Instructors fetched successfully",
      data: instructors,
    });
  } catch (err) {
    next(err);
  }
};

export const getInstructorByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const instructor = await getInstructorByIdUseCase.execute(String(req.params.id));

    res.status(200).json({
      success: true,
      message: "Instructor fetched successfully",
      data: instructor,
    });
  } catch (err) {
    next(err);
  }
};

export const updateInstructorController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const image = req.file
      ? (await uploadToS3(req.file, "instructors")).url
      : undefined;

    const instructor = await updateInstructorUseCase.execute(String(req.params.id), req.body, image);

    res.status(200).json({
      success: true,
      message: "Instructor updated successfully",
      data: instructor,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteInstructorController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteInstructorUseCase.execute(id);

    res.status(200).json({
      success: true,
      message: "Instructor deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const blockInstructorController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const instructor = await blockInstructorUseCase.execute(id);

    res.status(200).json({
      success: true,
      message:
        instructor.status === "Inactive"
          ? "Instructor blocked successfully"
          : "Instructor unblocked successfully",
      data: instructor,
    });
  } catch (err) {
    next(err);
  }
};
