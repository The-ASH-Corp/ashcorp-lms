import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class GetGeneralSettingsUseCase {
  constructor(private settingsRepository: HomepageSettingsRepository) {}

  async execute() {
    return await this.settingsRepository.getGeneralSettings();
  }
}
