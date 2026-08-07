import { MongoHomepageSettingsRepository } from "./infrastructure/repositories/MongoHomepageSettingsRepository";
import { GetHomepageSettingsUseCase } from "./application/usecase/GetHomepageSettingsUseCase";
import { UpdateHomepageSettingsUseCase } from "./application/usecase/UpdateHomepageSettingsUseCase";
import { GetAboutSettingsUseCase } from "./application/usecase/GetAboutSettingsUseCase";
import { UpdateAboutSettingsUseCase } from "./application/usecase/UpdateAboutSettingsUseCase";
import { GetContactSettingsUseCase } from "./application/usecase/GetContactSettingsUseCase";
import { UpdateContactSettingsUseCase } from "./application/usecase/UpdateContactSettingsUseCase";

export const homepageSettingsRepository = new MongoHomepageSettingsRepository();

export const getHomepageSettingsUseCase = new GetHomepageSettingsUseCase(homepageSettingsRepository);
export const updateHomepageSettingsUseCase = new UpdateHomepageSettingsUseCase(homepageSettingsRepository);

export const getAboutSettingsUseCase = new GetAboutSettingsUseCase(homepageSettingsRepository);
export const updateAboutSettingsUseCase = new UpdateAboutSettingsUseCase(homepageSettingsRepository);

export const getContactSettingsUseCase = new GetContactSettingsUseCase(homepageSettingsRepository);
export const updateContactSettingsUseCase = new UpdateContactSettingsUseCase(homepageSettingsRepository);
