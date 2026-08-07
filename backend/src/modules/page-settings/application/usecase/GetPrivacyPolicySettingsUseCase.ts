import { IPrivacyPolicySettingsEntity } from "../../domain/entities/PrivacyPolicySettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class GetPrivacyPolicySettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(): Promise<IPrivacyPolicySettingsEntity> {
    return this.repository.getPrivacyPolicySettings();
  }
}
