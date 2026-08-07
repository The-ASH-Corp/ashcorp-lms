import { IHomepageSettingsEntity } from "../../domain/entities/HomepageSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class GetHomepageSettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(): Promise<IHomepageSettingsEntity> {
    return this.repository.getSettings();
  }
}
