import { Request, Response, NextFunction } from "express";
import { loginUsecase, registerUsecase } from "../di";
import { RegisterDTO } from "../application/dto/RegisterDTO";
import { LoginDTO } from "../application/dto/LoginDTO";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body: RegisterDTO = req.body;

    const result = await registerUsecase.execute(body);

    res.status(201).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body: LoginDTO = req.body;

    const result = await loginUsecase.execute(body);

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({ result: result.user, token: result.token, message: "Login successful" });
  } catch (error: any) {
    next(error);
  }
};
