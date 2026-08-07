import { IContactSettingsEntity } from "../../domain/entities/ContactSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class UpdateContactSettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(data: Partial<IContactSettingsEntity>): Promise<IContactSettingsEntity> {
    return this.repository.updateContactSettings(data);
  }
}
