import { Request, Response, NextFunction } from "express";
import {
  getHomepageSettingsUseCase,
  updateHomepageSettingsUseCase,
  getAboutSettingsUseCase,
  updateAboutSettingsUseCase,
  getContactSettingsUseCase,
  updateContactSettingsUseCase,
} from "../di";

export const getHomepageSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getHomepageSettingsUseCase.execute();

    res.status(200).json({
      success: true,
      message: "Homepage settings fetched successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHomepageSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await updateHomepageSettingsUseCase.execute(req.body);

    res.status(200).json({
      success: true,
      message: "Homepage settings updated successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const getAboutSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getAboutSettingsUseCase.execute();

    res.status(200).json({
      success: true,
      message: "About page settings fetched successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAboutSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await updateAboutSettingsUseCase.execute(req.body);

    res.status(200).json({
      success: true,
      message: "About page settings updated successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getContactSettingsUseCase.execute();

    res.status(200).json({
      success: true,
      message: "Contact page settings fetched successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await updateContactSettingsUseCase.execute(req.body);

    res.status(200).json({
      success: true,
      message: "Contact page settings updated successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
