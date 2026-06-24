import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserModel } from "../models/UserModel";

export class MongoUserRepository implements UserRepository{
    async create(data: {
        name: string;
        phone: string;
        email: string;
        password: string;
    }): Promise<User> {
        const user = await UserModel.create(data);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({email});
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        return user;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = await UserModel.findByIdAndUpdate(id,data,{new:true});
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }

    async delete(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id);
    }
    
    async findAll(): Promise<User[]> {
        const users = await UserModel.find();
        return users;
    }
}