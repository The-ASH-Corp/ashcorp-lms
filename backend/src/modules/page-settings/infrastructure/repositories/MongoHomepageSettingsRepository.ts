import { IHomepageSettingsEntity } from "../../domain/entities/HomepageSettings";
import { IAboutSettingsEntity } from "../../domain/entities/AboutSettings";
import { IContactSettingsEntity } from "../../domain/entities/ContactSettings";
import { IPrivacyPolicySettingsEntity } from "../../domain/entities/PrivacyPolicySettings";
import { ITermsConditionsSettingsEntity } from "../../domain/entities/TermsConditionsSettings";
import { IGeneralSettingsEntity } from "../../domain/entities/GeneralSettings";
import { IAuthSettingsEntity } from "../../domain/entities/AuthSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";
import {
  HomepageSettingsModel,
  AboutSettingsModel,
  ContactSettingsModel,
  PrivacyPolicySettingsModel,
  TermsConditionsSettingsModel,
  GeneralSettingsModel,
  AuthSettingsModel,
} from "../pageSettings.model";

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
        (settings as any).testimonialsSection = { ...settings.testimonialsSection, ...data.testimonialsSection };
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

  async getPrivacyPolicySettings(): Promise<IPrivacyPolicySettingsEntity> {
    let settings = await PrivacyPolicySettingsModel.findOne();
    if (!settings) {
      settings = await PrivacyPolicySettingsModel.create({});
    }
    return settings as unknown as IPrivacyPolicySettingsEntity;
  }

  async updatePrivacyPolicySettings(data: Partial<IPrivacyPolicySettingsEntity>): Promise<IPrivacyPolicySettingsEntity> {
    let settings = await PrivacyPolicySettingsModel.findOne();

    if (!settings) {
      settings = await PrivacyPolicySettingsModel.create(data);
    } else {
      if (data.sectionVisibility) settings.sectionVisibility = { ...settings.sectionVisibility, ...data.sectionVisibility };
      if (data.metadata) settings.metadata = { ...settings.metadata, ...data.metadata };
      if (data.hero) settings.hero = { ...settings.hero, ...data.hero };
      if (data.policySections) (settings as any).policySections = { ...settings.policySections, ...data.policySections };
      if (data.supportCta) settings.supportCta = { ...settings.supportCta, ...data.supportCta };

      await settings.save();
    }

    return settings as unknown as IPrivacyPolicySettingsEntity;
  }

  async getTermsConditionsSettings(): Promise<ITermsConditionsSettingsEntity> {
    let settings = await TermsConditionsSettingsModel.findOne();
    if (!settings) {
      settings = await TermsConditionsSettingsModel.create({});
    }
    return settings as unknown as ITermsConditionsSettingsEntity;
  }

  async updateTermsConditionsSettings(data: Partial<ITermsConditionsSettingsEntity>): Promise<ITermsConditionsSettingsEntity> {
    let settings = await TermsConditionsSettingsModel.findOne();

    if (!settings) {
      settings = await TermsConditionsSettingsModel.create(data);
    } else {
      if (data.sectionVisibility) settings.sectionVisibility = { ...settings.sectionVisibility, ...data.sectionVisibility };
      if (data.metadata) settings.metadata = { ...settings.metadata, ...data.metadata };
      if (data.hero) settings.hero = { ...settings.hero, ...data.hero };
      if (data.termsSections) (settings as any).termsSections = { ...settings.termsSections, ...data.termsSections };

      await settings.save();
    }

    return settings as unknown as ITermsConditionsSettingsEntity;
  }

  async getGeneralSettings(): Promise<IGeneralSettingsEntity> {
    let settings = await GeneralSettingsModel.findOne();
    if (!settings) {
      settings = await GeneralSettingsModel.create({});
    }
    return settings as unknown as IGeneralSettingsEntity;
  }

  async updateGeneralSettings(data: Partial<IGeneralSettingsEntity>): Promise<IGeneralSettingsEntity> {
    let settings = await GeneralSettingsModel.findOne();
    if (!settings) {
      settings = await GeneralSettingsModel.create(data);
    } else {
      if (data.logoUrl !== undefined) settings.logoUrl = data.logoUrl;
      await settings.save();
    }
    return settings as unknown as IGeneralSettingsEntity;
  }

  async getAuthSettings(): Promise<IAuthSettingsEntity> {
    let settings = await AuthSettingsModel.findOne();
    if (!settings) {
      settings = await AuthSettingsModel.create({});
    }
    return settings as unknown as IAuthSettingsEntity;
  }

  async updateAuthSettings(data: Partial<IAuthSettingsEntity>): Promise<IAuthSettingsEntity> {
    let settings = await AuthSettingsModel.findOne();
    if (!settings) {
      settings = await AuthSettingsModel.create(data);
    } else {
      if (data.heroImage !== undefined) settings.heroImage = data.heroImage;
      if (data.heading !== undefined) settings.heading = data.heading;
      if (data.headingHighlight1 !== undefined) settings.headingHighlight1 = data.headingHighlight1;
      if (data.headingHighlight2 !== undefined) settings.headingHighlight2 = data.headingHighlight2;
      if (data.description !== undefined) settings.description = data.description;
      if (data.footerText !== undefined) settings.footerText = data.footerText;
      await settings.save();
    }
    return settings as unknown as IAuthSettingsEntity;
  }
}
