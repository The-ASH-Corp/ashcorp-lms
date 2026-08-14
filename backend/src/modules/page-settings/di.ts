import { MongoHomepageSettingsRepository } from "./infrastructure/repositories/MongoHomepageSettingsRepository";
import { GetHomepageSettingsUseCase } from "./application/usecase/GetHomepageSettingsUseCase";
import { UpdateHomepageSettingsUseCase } from "./application/usecase/UpdateHomepageSettingsUseCase";
import { GetAboutSettingsUseCase } from "./application/usecase/GetAboutSettingsUseCase";
import { UpdateAboutSettingsUseCase } from "./application/usecase/UpdateAboutSettingsUseCase";
import { GetContactSettingsUseCase } from "./application/usecase/GetContactSettingsUseCase";
import { UpdateContactSettingsUseCase } from "./application/usecase/UpdateContactSettingsUseCase";
import { GetPrivacyPolicySettingsUseCase } from "./application/usecase/GetPrivacyPolicySettingsUseCase";
import { UpdatePrivacyPolicySettingsUseCase } from "./application/usecase/UpdatePrivacyPolicySettingsUseCase";
import { GetTermsConditionsSettingsUseCase } from "./application/usecase/GetTermsConditionsSettingsUseCase";
import { UpdateTermsConditionsSettingsUseCase } from "./application/usecase/UpdateTermsConditionsSettingsUseCase";

export const homepageSettingsRepository = new MongoHomepageSettingsRepository();

export const getHomepageSettingsUseCase = new GetHomepageSettingsUseCase(homepageSettingsRepository);
export const updateHomepageSettingsUseCase = new UpdateHomepageSettingsUseCase(homepageSettingsRepository);

export const getAboutSettingsUseCase = new GetAboutSettingsUseCase(homepageSettingsRepository);
export const updateAboutSettingsUseCase = new UpdateAboutSettingsUseCase(homepageSettingsRepository);

export const getContactSettingsUseCase = new GetContactSettingsUseCase(homepageSettingsRepository);
export const updateContactSettingsUseCase = new UpdateContactSettingsUseCase(homepageSettingsRepository);

export const getPrivacyPolicySettingsUseCase = new GetPrivacyPolicySettingsUseCase(homepageSettingsRepository);
export const updatePrivacyPolicySettingsUseCase = new UpdatePrivacyPolicySettingsUseCase(homepageSettingsRepository);

export const getTermsConditionsSettingsUseCase = new GetTermsConditionsSettingsUseCase(homepageSettingsRepository);
export const updateTermsConditionsSettingsUseCase = new UpdateTermsConditionsSettingsUseCase(homepageSettingsRepository);

import { GetGeneralSettingsUseCase } from "./application/usecase/GetGeneralSettingsUseCase";
import { UpdateGeneralSettingsUseCase } from "./application/usecase/UpdateGeneralSettingsUseCase";
import { GetAuthSettingsUseCase } from "./application/usecase/GetAuthSettingsUseCase";
import { UpdateAuthSettingsUseCase } from "./application/usecase/UpdateAuthSettingsUseCase";

export const getGeneralSettingsUseCase = new GetGeneralSettingsUseCase(homepageSettingsRepository);
export const updateGeneralSettingsUseCase = new UpdateGeneralSettingsUseCase(homepageSettingsRepository);

export const getAuthSettingsUseCase = new GetAuthSettingsUseCase(homepageSettingsRepository);
export const updateAuthSettingsUseCase = new UpdateAuthSettingsUseCase(homepageSettingsRepository);
