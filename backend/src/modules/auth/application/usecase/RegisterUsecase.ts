import { User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export class RegisterUsecase{
    constructor(
        private readonly userRepository: UserRepository,
    ){}

    async execute(data:User):Promise<User|null>{
        const {name,phone,email,password} = data;

        const existingUser = await this.userRepository.findByEmail(email);

        if(existingUser){
            throw new Error("User already exists");
        }
        
        const user = await this.userRepository.create(data);
        return user;
    }

}