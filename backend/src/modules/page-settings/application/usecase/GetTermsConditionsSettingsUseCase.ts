import { ITermsConditionsSettingsEntity } from "../../domain/entities/TermsConditionsSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class GetTermsConditionsSettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(): Promise<ITermsConditionsSettingsEntity> {
    return this.repository.getTermsConditionsSettings();
  }
}
