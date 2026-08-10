import { ITermsConditionsSettingsEntity } from "../../domain/entities/TermsConditionsSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class UpdateTermsConditionsSettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(data: Partial<ITermsConditionsSettingsEntity>): Promise<ITermsConditionsSettingsEntity> {
    return this.repository.updateTermsConditionsSettings(data);
  }
}
