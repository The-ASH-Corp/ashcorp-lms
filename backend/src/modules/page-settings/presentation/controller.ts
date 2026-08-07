import { Request, Response, NextFunction } from "express";
import { HomepageSettingsModel } from "../infrastructure/pageSettings.model";

export const getHomepageSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let settings = await HomepageSettingsModel.findOne();
    if (!settings) {
      settings = await HomepageSettingsModel.create({});
    }

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
    let settings = await HomepageSettingsModel.findOne();

    if (!settings) {
      settings = await HomepageSettingsModel.create(req.body);
    } else {
      if (req.body.hero) settings.hero = { ...settings.hero, ...req.body.hero };
      if (req.body.stats) settings.stats = { ...settings.stats, ...req.body.stats };
      if (req.body.categories) settings.categories = { ...settings.categories, ...req.body.categories };
      if (req.body.trendingWorkshops)
        settings.trendingWorkshops = { ...settings.trendingWorkshops, ...req.body.trendingWorkshops };
      if (req.body.graduates) settings.graduates = { ...settings.graduates, ...req.body.graduates };
      if (req.body.testimonialsSection)
        settings.testimonialsSection = { ...settings.testimonialsSection, ...req.body.testimonialsSection };
      if (req.body.footer) settings.footer = { ...settings.footer, ...req.body.footer };

      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: "Homepage settings updated successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
