import { adminRepository } from "../admins/di";
import { MongoUserRepository } from "../users/infrastructure/repositories/MongoUserRepository";
import { LoginUsecase } from "./application/usecase/LoginUsecase";
import { RegisterUsecase } from "./application/usecase/RegisterUsecase";
import { ChangePasswordUseCase } from "./application/usecase/ChangePasswordUseCase";
import { RequestPasswordResetOtpUseCase } from "./application/usecase/RequestPasswordResetOtpUseCase";
import { ResetPasswordWithOtpUseCase } from "./application/usecase/ResetPasswordWithOtpUseCase";

export { adminRepository };

export const userRepository = new MongoUserRepository();
// Register Usecase
export const registerUsecase = new RegisterUsecase(userRepository);
// Login Usecase
export const loginUsecase = new LoginUsecase(userRepository,adminRepository);
// Change Password Usecase
export const changePasswordUseCase = new ChangePasswordUseCase(userRepository, adminRepository);
// Forgot Password Usecases
export const requestPasswordResetOtpUseCase = new RequestPasswordResetOtpUseCase(userRepository, adminRepository);
export const resetPasswordWithOtpUseCase = new ResetPasswordWithOtpUseCase(userRepository, adminRepository);
