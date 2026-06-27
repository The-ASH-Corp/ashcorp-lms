import { type CookieOptions, Request, Response, NextFunction } from "express";
import { loginUsecase, registerUsecase, userRepository } from "../di";
import { RegisterDTO } from "../application/dto/RegisterDTO";
import { LoginDTO } from "../application/dto/LoginDTO";
import { ENV } from "../../../shared/env/ENV";
import { AppError } from "../../../shared/error/AppError";

const isProduction = ENV.NODE_ENV === "production";

const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 1000 * 60 * 60,
  path: "/",
};

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

    res.cookie("accessToken", result.token, accessTokenCookieOptions);

    res
      .status(200)
      .json({
        user: result.user,
        token: result.token,
        message: "Login successful",
      });
  } catch (error: any) {
    next(error);
  }
};

export const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await userRepository.findById(String(userId));

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (error: any) {
    next(error);
  }
};
