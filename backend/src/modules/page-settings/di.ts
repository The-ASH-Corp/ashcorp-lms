import { MongoHomepageSettingsRepository } from "./infrastructure/repositories/MongoHomepageSettingsRepository";
import { GetHomepageSettingsUseCase } from "./application/usecase/GetHomepageSettingsUseCase";
import { UpdateHomepageSettingsUseCase } from "./application/usecase/UpdateHomepageSettingsUseCase";
import { GetAboutSettingsUseCase } from "./application/usecase/GetAboutSettingsUseCase";
import { UpdateAboutSettingsUseCase } from "./application/usecase/UpdateAboutSettingsUseCase";

export const homepageSettingsRepository = new MongoHomepageSettingsRepository();

export const getHomepageSettingsUseCase = new GetHomepageSettingsUseCase(homepageSettingsRepository);
export const updateHomepageSettingsUseCase = new UpdateHomepageSettingsUseCase(homepageSettingsRepository);

export const getAboutSettingsUseCase = new GetAboutSettingsUseCase(homepageSettingsRepository);
export const updateAboutSettingsUseCase = new UpdateAboutSettingsUseCase(homepageSettingsRepository);
