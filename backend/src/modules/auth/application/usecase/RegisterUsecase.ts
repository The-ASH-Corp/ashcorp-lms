import { User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { RegisterDTO } from "../dto/RegisterDTO";
import { AppError } from "../../../../shared/error/AppError";

export class RegisterUsecase{
    constructor(
        private readonly userRepository: UserRepository,
    ){}

    async execute(data: RegisterDTO):Promise<User|null>{
        const { email } = data;

        const existingUser = await this.userRepository.findByEmail(email);

        if(existingUser){
            throw new AppError("User already exists", 409);
        }
        
        let user = await this.userRepository.create(data);

        return user;
    }

}