import { IHomepageSettingsEntity } from "../entities/HomepageSettings";
import { IAboutSettingsEntity } from "../entities/AboutSettings";

export interface HomepageSettingsRepository {
  getSettings(): Promise<IHomepageSettingsEntity>;
  updateSettings(data: Partial<IHomepageSettingsEntity>): Promise<IHomepageSettingsEntity>;
  getAboutSettings(): Promise<IAboutSettingsEntity>;
  updateAboutSettings(data: Partial<IAboutSettingsEntity>): Promise<IAboutSettingsEntity>;
}
