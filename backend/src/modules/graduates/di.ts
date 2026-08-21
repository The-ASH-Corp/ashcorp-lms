import { CreateGraduateWorkUseCase } from "./application/usecase/CreateGraduateWorkUseCase";
import { DeleteGraduateUseCase } from "./application/usecase/DeleteGraduateUseCase";
import { GetAllGraduatesDetails } from "./application/usecase/GetAllGraduatesDetails";
import { GetFeaturedGraduatesUseCase } from "./application/usecase/GetFeaturedGraduatesUseCase";
import { GetGraduateByIdUseCase } from "./application/usecase/GetGraduateByIdUseCase";
import { ToggleGraduateFeatureUseCase } from "./application/usecase/ToggleGraduateFeatureUseCase";
import { UpdateGraduateUseCase } from "./application/usecase/UpdateGraduateUseCase";
import { MongoGraduateRepository } from "./infrastructure/repositories/MongoGraduateRepository";
import { GetPaginatedGraduatesUseCase } from "./application/usecase/GetPaginatedGraduatesUseCase";

const graduateRepository = new MongoGraduateRepository();

export const graduateWorkCreateUseCase = new CreateGraduateWorkUseCase(
  graduateRepository
);

export const getAllGraduatesDetails = new GetAllGraduatesDetails(
  graduateRepository
);

export const getFeaturedGraduatesUseCase = new GetFeaturedGraduatesUseCase(
  graduateRepository
);

export const getGraduateByIdUseCase = new GetGraduateByIdUseCase(
  graduateRepository
);

export const updateGraduateUseCase = new UpdateGraduateUseCase(
  graduateRepository
);

export const toggleGraduateFeatureUseCase = new ToggleGraduateFeatureUseCase(
  graduateRepository
);

export const deleteGraduateUseCase = new DeleteGraduateUseCase(
  graduateRepository
);

export const getPaginatedGraduatesUseCase = new GetPaginatedGraduatesUseCase(
  graduateRepository
);
