import { Request, Response, NextFunction } from "express";
import {
  getHomepageSettingsUseCase,
  updateHomepageSettingsUseCase,
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
