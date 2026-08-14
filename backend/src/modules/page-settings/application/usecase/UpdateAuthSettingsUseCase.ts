import { IAuthSettingsEntity } from "../../domain/entities/AuthSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class UpdateAuthSettingsUseCase {
  constructor(private readonly homepageSettingsRepository: HomepageSettingsRepository) {}

  async execute(data: Partial<IAuthSettingsEntity>): Promise<IAuthSettingsEntity> {
    return await this.homepageSettingsRepository.updateAuthSettings(data);
  }
}
