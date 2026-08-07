import { type CookieOptions, Request, Response, NextFunction } from "express";
import {
  adminRepository,
  loginUsecase,
  registerUsecase,
  userRepository,
  changePasswordUseCase,
  requestPasswordResetOtpUseCase,
  resetPasswordWithOtpUseCase,
} from "../di";
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
    // console.log("register called....");
    
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
    const admin = user ? null : await adminRepository.findById(String(userId));
    const currentUser = user ?? admin;

    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    const purchasedCourses = "purchasedCourses" in currentUser ? currentUser.purchasedCourses || [] : [];
    const certificates = "certificates" in currentUser ? currentUser.certificates || [] : [];
    const examAttempts = "examAttempts" in currentUser ? currentUser.examAttempts || [] : [];

    res.status(200).json({
      id: currentUser._id?.toString(),
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      role: currentUser.role,
      profileImage: currentUser.profileImage,
      purchasedCourses,
      certificates,
      examAttempts,
    });
  } catch (error: any) {
    next(error);
  }
};

export const logoutController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.clearCookie("accessToken", accessTokenCookieOptions);

    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = String(req.userId);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    await changePasswordUseCase.execute(userId, {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const requestPasswordResetOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    await requestPasswordResetOtpUseCase.execute(email);

    res.status(200).json({
      success: true,
      message: "If an account exists with this email, an OTP has been sent.",
    });
  } catch (error: any) {
    next(error);
  }
};

export const resetPasswordWithOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    await resetPasswordWithOtpUseCase.execute({
      email,
      otp,
      newPassword,
      confirmPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with your new password.",
    });
  } catch (error: any) {
    next(error);
  }
};