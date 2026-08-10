import { IAboutSettingsEntity } from "../../domain/entities/AboutSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class GetAboutSettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(): Promise<IAboutSettingsEntity> {
    return this.repository.getAboutSettings();
  }
}
