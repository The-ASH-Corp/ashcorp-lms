import { IContactSettingsEntity } from "../../domain/entities/ContactSettings";
import { HomepageSettingsRepository } from "../../domain/repositories/HomepageSettingsRepository";

export class GetContactSettingsUseCase {
  constructor(private readonly repository: HomepageSettingsRepository) {}

  async execute(): Promise<IContactSettingsEntity> {
    return this.repository.getContactSettings();
  }
}
