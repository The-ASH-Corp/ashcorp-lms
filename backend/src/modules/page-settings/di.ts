import { MongoHomepageSettingsRepository } from "./infrastructure/repositories/MongoHomepageSettingsRepository";
import { GetHomepageSettingsUseCase } from "./application/usecase/GetHomepageSettingsUseCase";
import { UpdateHomepageSettingsUseCase } from "./application/usecase/UpdateHomepageSettingsUseCase";

export const homepageSettingsRepository = new MongoHomepageSettingsRepository();

export const getHomepageSettingsUseCase = new GetHomepageSettingsUseCase(homepageSettingsRepository);

export const updateHomepageSettingsUseCase = new UpdateHomepageSettingsUseCase(homepageSettingsRepository);
