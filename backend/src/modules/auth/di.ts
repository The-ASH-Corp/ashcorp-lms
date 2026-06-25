import { MongoUserRepository } from "../users/infrastructure/repositories/MongoUserRepository";
import { LoginUsecase } from "./application/usecase/LoginUsecase";
import { RegisterUsecase } from "./application/usecase/RegisterUsecase";


const userRepository = new MongoUserRepository();
// Regiuster Usecase
export const registerUsecase = new RegisterUsecase(userRepository);
// Login Usecase
export const loginUsecase = new LoginUsecase(userRepository);
