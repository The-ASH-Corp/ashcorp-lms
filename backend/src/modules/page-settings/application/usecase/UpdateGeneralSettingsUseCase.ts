import { IGeneralSettingsEntity } from "../../domain/entities/GeneralSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class UpdateGeneralSettingsUseCase {
  constructor(private settingsRepository: HomepageSettingsRepository) {}

  async execute(data: Partial<IGeneralSettingsEntity>) {
    return await this.settingsRepository.updateGeneralSettings(data);
  }
}
