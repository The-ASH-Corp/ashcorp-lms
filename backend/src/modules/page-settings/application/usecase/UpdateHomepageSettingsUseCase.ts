import { IHomepageSettingsEntity } from "../../domain/entities/HomepageSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class UpdateHomepageSettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(data: Partial<IHomepageSettingsEntity>): Promise<IHomepageSettingsEntity> {
    return this.repository.updateSettings(data);
  }
}
