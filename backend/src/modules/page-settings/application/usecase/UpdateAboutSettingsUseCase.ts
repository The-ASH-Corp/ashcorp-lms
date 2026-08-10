import { IAboutSettingsEntity } from "../../domain/entities/AboutSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class UpdateAboutSettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(data: Partial<IAboutSettingsEntity>): Promise<IAboutSettingsEntity> {
    return this.repository.updateAboutSettings(data);
  }
}
