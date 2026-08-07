import { IHomepageSettingsEntity } from "../../domain/entities/HomepageSettings";
import { IAboutSettingsEntity } from "../../domain/entities/AboutSettings";
import { IContactSettingsEntity } from "../../domain/entities/ContactSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";
import { HomepageSettingsModel, AboutSettingsModel, ContactSettingsModel } from "../pageSettings.model";

export class MongoHomepageSettingsRepository implements HomepageSettingsRepository {
  async getSettings(): Promise<IHomepageSettingsEntity> {
    let settings = await HomepageSettingsModel.findOne();
    if (!settings) {
      settings = await HomepageSettingsModel.create({});
    }
    return settings as unknown as IHomepageSettingsEntity;
  }

  async updateSettings(data: Partial<IHomepageSettingsEntity>): Promise<IHomepageSettingsEntity> {
    let settings = await HomepageSettingsModel.findOne();

    if (!settings) {
      settings = await HomepageSettingsModel.create(data);
    } else {
      if (data.hero) settings.hero = { ...settings.hero, ...data.hero };
      if (data.stats) settings.stats = { ...settings.stats, ...data.stats };
      if (data.categories) settings.categories = { ...settings.categories, ...data.categories };
      if (data.trendingWorkshops)
        settings.trendingWorkshops = { ...settings.trendingWorkshops, ...data.trendingWorkshops };
      if (data.graduates) settings.graduates = { ...settings.graduates, ...data.graduates };
      if (data.testimonialsSection)
        settings.testimonialsSection = { ...settings.testimonialsSection, ...data.testimonialsSection };
      if (data.footer) settings.footer = { ...settings.footer, ...data.footer };

      await settings.save();
    }

    return settings as unknown as IHomepageSettingsEntity;
  }

  async getAboutSettings(): Promise<IAboutSettingsEntity> {
    let settings = await AboutSettingsModel.findOne();
    if (!settings) {
      settings = await AboutSettingsModel.create({});
    }
    return settings as unknown as IAboutSettingsEntity;
  }

  async updateAboutSettings(data: Partial<IAboutSettingsEntity>): Promise<IAboutSettingsEntity> {
    let settings = await AboutSettingsModel.findOne();

    if (!settings) {
      settings = await AboutSettingsModel.create(data);
    } else {
      if (data.sectionVisibility) settings.sectionVisibility = { ...settings.sectionVisibility, ...data.sectionVisibility };
      if (data.hero) settings.hero = { ...settings.hero, ...data.hero };
      if (data.leadership) (settings as any).leadership = { ...settings.leadership, ...data.leadership };
      if (data.impactMetrics) settings.impactMetrics = { ...settings.impactMetrics, ...data.impactMetrics };
      if (data.coreValues) (settings as any).coreValues = { ...settings.coreValues, ...data.coreValues };
      if (data.philosophy) settings.philosophy = { ...settings.philosophy, ...data.philosophy };

      await settings.save();
    }

    return settings as unknown as IAboutSettingsEntity;
  }

  async getContactSettings(): Promise<IContactSettingsEntity> {
    let settings = await ContactSettingsModel.findOne();
    if (!settings) {
      settings = await ContactSettingsModel.create({});
    }
    return settings as unknown as IContactSettingsEntity;
  }

  async updateContactSettings(data: Partial<IContactSettingsEntity>): Promise<IContactSettingsEntity> {
    let settings = await ContactSettingsModel.findOne();

    if (!settings) {
      settings = await ContactSettingsModel.create(data);
    } else {
      if (data.sectionVisibility) settings.sectionVisibility = { ...settings.sectionVisibility, ...data.sectionVisibility };
      if (data.metadata) settings.metadata = { ...settings.metadata, ...data.metadata };
      if (data.hero) settings.hero = { ...settings.hero, ...data.hero };
      if (data.inquiryForm) settings.inquiryForm = { ...settings.inquiryForm, ...data.inquiryForm };
      if (data.directories) settings.directories = { ...settings.directories, ...data.directories };
      if (data.locationMap) settings.locationMap = { ...settings.locationMap, ...data.locationMap };
      if (data.faqs) (settings as any).faqs = { ...settings.faqs, ...data.faqs };

      await settings.save();
    }

    return settings as unknown as IContactSettingsEntity;
  }
}
