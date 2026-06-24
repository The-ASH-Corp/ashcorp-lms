import { Request, Response } from "express";
import { MongoUserRepository } from "../../users/infrastructure/repositories/MongoUserRepository";
import { RegisterUsecase } from "../application/usecase/RegisterUsecase";

const userRepository = new MongoUserRepository();
const registerUsecase = new RegisterUsecase(userRepository);



export const registerController = async (req:Request, res:Response) => {
    try {
        const {name,phone,email,password} = req.body;

        const result = await registerUsecase.execute({name,phone,email,password});
        
        return res.status(201).json(result);
        
    } catch (error:any) {
        return res.status(500).json({ error:error.message });
    }
}   