import { NextFunction, Request, Response } from "express";
import { submitInquiryUseCase } from "../di";
import { SubmitInquiryDTO } from "../application/dto/SubmitInquiryDTO";

export const submitInquiryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body: SubmitInquiryDTO = req.body;

    await submitInquiryUseCase.execute(body);

    res.status(200).json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};
