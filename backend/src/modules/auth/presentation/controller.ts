import { Request, Response, NextFunction } from "express";
import { registerUsecase } from "../di";
import { RegisterDTO } from "../application/dto/RegisterDTO";

export const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: RegisterDTO = req.body;

        const result = await registerUsecase.execute(body);
        
        res.status(201).json(result);
        
    } catch (error: any) {
        next(error);
    }
}   