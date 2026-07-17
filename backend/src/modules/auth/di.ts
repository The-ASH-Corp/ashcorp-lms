import { adminRepository } from "../admins/di";
import { MongoUserRepository } from "../users/infrastructure/repositories/MongoUserRepository";
import { LoginUsecase } from "./application/usecase/LoginUsecase";
import { RegisterUsecase } from "./application/usecase/RegisterUsecase";
import { ChangePasswordUseCase } from "./application/usecase/ChangePasswordUseCase";

export { adminRepository };

export const userRepository = new MongoUserRepository();
// Register Usecase
export const registerUsecase = new RegisterUsecase(userRepository);
// Login Usecase
export const loginUsecase = new LoginUsecase(userRepository,adminRepository);
// Change Password Usecase
export const changePasswordUseCase = new ChangePasswordUseCase(userRepository, adminRepository);
