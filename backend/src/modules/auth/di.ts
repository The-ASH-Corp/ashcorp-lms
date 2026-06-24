import { MongoUserRepository } from "../users/infrastructure/repositories/MongoUserRepository";
import { RegisterUsecase } from "./application/usecase/RegisterUsecase";

const userRepository = new MongoUserRepository();
export const registerUsecase = new RegisterUsecase(userRepository);
