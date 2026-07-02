import { adminRepository } from "../admins/di";
import { MongoUserRepository } from "../users/infrastructure/repositories/MongoUserRepository";
import { LoginUsecase } from "./application/usecase/LoginUsecase";
import { RegisterUsecase } from "./application/usecase/RegisterUsecase";

export { adminRepository };

export const userRepository = new MongoUserRepository();
// Register Usecase
export const registerUsecase = new RegisterUsecase(userRepository);
// Login Usecase
export const loginUsecase = new LoginUsecase(userRepository,adminRepository);
