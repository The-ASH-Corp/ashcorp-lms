import { IAuthSettingsEntity } from "../../domain/entities/AuthSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class GetAuthSettingsUseCase {
  constructor(private readonly homepageSettingsRepository: HomepageSettingsRepository) {}

  async execute(): Promise<IAuthSettingsEntity> {
    return await this.homepageSettingsRepository.getAuthSettings();
  }
}
