import { User } from "../entities/User";
import { RegisterDTO } from "../../../auth/application/dto/RegisterDTO";

export interface UserRepository{
    
    create(data: RegisterDTO):Promise<User>;

    findByEmail(email:string):Promise<User|null>;

    findAll():Promise<User[]>;

}