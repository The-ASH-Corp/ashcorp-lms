import { IHomepageSettingsEntity } from "../entities/HomepageSettings";

export interface HomepageSettingsRepository {
  getSettings(): Promise<IHomepageSettingsEntity>;
  updateSettings(data: Partial<IHomepageSettingsEntity>): Promise<IHomepageSettingsEntity>;
}
