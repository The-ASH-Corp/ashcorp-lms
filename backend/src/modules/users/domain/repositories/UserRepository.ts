import { User } from "../entities/User";

export interface UserRepository{
    create(data:{
        name:string;
        phone:string;
        email:string;
        password:string;
    }):Promise<User>;

    findByEmail(email:string):Promise<User|null>;

    findById(id:string):Promise<User|null>;

    update(id:string,data:Partial<User>):Promise<User>;

    delete(id:string):Promise<void>;

    findAll():Promise<User[]>;
}