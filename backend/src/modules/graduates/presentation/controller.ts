import { NextFunction, Request, Response } from "express";
import { CreateGraduateRequestDTO } from "../application/dto/GraduateDTO";
import {
  deleteGraduateUseCase,
  getAllGraduatesDetails,
  getFeaturedGraduatesUseCase,
  getGraduateByIdUseCase,
  graduateWorkCreateUseCase,
  toggleGraduateFeatureUseCase,
  updateGraduateUseCase,
} from "../di";
import { GraduateImageService } from "../infrastructure/services/GraduateImageService";

// Create graduate card
export const createGraduateController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;

    const imageUrl = await GraduateImageService.processAndUpload(
      files?.image?.[0],
      req.body.image,
      "student-image"
    );
    const companyLogoUrl = await GraduateImageService.processAndUpload(
      files?.companyLogo?.[0],
      req.body.companyLogo,
      "company-logo"
    );

    const featureOnLandingPage =
      req.body.featureOnLandingPage === "true" ||
      req.body.featureOnLandingPage === true;

    const body: CreateGraduateRequestDTO = {
      name: req.body.name,
      positionName: req.body.positionName,
      image: imageUrl,
      companyLogo: companyLogoUrl,
      featureOnLandingPage,
    };

    const result = await graduateWorkCreateUseCase.execute(body);

    res.status(201).json({
      success: true,
      message: "Graduate Card created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch all graduates
export const getAllGraduateWorks = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const graduateWorks = await getAllGraduatesDetails.execute();

    res.status(200).json({
      success: true,
      message: "Graduate Cards fetched successfully",
      data: graduateWorks,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch featured graduates for landing page showcase
export const getFeaturedGraduatesController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const featuredGraduates = await getFeaturedGraduatesUseCase.execute();

    res.status(200).json({
      success: true,
      message: "Featured graduates fetched successfully",
      data: featuredGraduates,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch single graduate by ID
export const getGraduateByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const graduate = await getGraduateByIdUseCase.execute(id);

    res.status(200).json({
      success: true,
      message: "Graduate fetched successfully",
      data: graduate,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle graduate featured status
export const toggleGraduateFeatureController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updated = await toggleGraduateFeatureUseCase.execute(id);

    res.status(200).json({
      success: true,
      message: "Graduate feature status updated",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Update graduate card details
export const updateGraduateController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
    const updateData: any = { ...req.body };

    if (files?.image?.[0] || updateData.image) {
      updateData.image = await GraduateImageService.processAndUpload(
        files?.image?.[0],
        updateData.image,
        "student-image"
      );
    }

    if (files?.companyLogo?.[0] || updateData.companyLogo) {
      updateData.companyLogo = await GraduateImageService.processAndUpload(
        files?.companyLogo?.[0],
        updateData.companyLogo,
        "company-logo"
      );
    }

    if (typeof updateData.featureOnLandingPage !== "undefined") {
      updateData.featureOnLandingPage =
        updateData.featureOnLandingPage === "true" ||
        updateData.featureOnLandingPage === true;
    }

    const updated = await updateGraduateUseCase.execute(id, updateData);

    res.status(200).json({
      success: true,
      message: "Graduate updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Delete graduate card
export const deleteGraduateController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteGraduateUseCase.execute(id);

    res.status(200).json({
      success: true,
      message: "Graduate deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
