import { IHomepageSettingsEntity } from "../entities/HomepageSettings";
import { IAboutSettingsEntity } from "../entities/AboutSettings";
import { IContactSettingsEntity } from "../entities/ContactSettings";

export interface HomepageSettingsRepository {
  getSettings(): Promise<IHomepageSettingsEntity>;
  updateSettings(data: Partial<IHomepageSettingsEntity>): Promise<IHomepageSettingsEntity>;
  getAboutSettings(): Promise<IAboutSettingsEntity>;
  updateAboutSettings(data: Partial<IAboutSettingsEntity>): Promise<IAboutSettingsEntity>;
  getContactSettings(): Promise<IContactSettingsEntity>;
  updateContactSettings(data: Partial<IContactSettingsEntity>): Promise<IContactSettingsEntity>;
}
