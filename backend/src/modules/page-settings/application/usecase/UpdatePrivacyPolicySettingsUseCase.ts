import { IPrivacyPolicySettingsEntity } from "../../domain/entities/PrivacyPolicySettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class UpdatePrivacyPolicySettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(data: Partial<IPrivacyPolicySettingsEntity>): Promise<IPrivacyPolicySettingsEntity> {
    return this.repository.updatePrivacyPolicySettings(data);
  }
}
