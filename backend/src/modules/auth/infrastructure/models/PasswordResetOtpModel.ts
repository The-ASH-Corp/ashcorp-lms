import mongoose from "mongoose";

const passwordResetOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    attempts: {
      type: Number,
      default: 0,
    },
    requestCount: {
      type: Number,
      default: 0,
    },
    requestWindowStart: {
      type: Date,
      default: null,
    },
    lastRequestedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const PasswordResetOtpModel = mongoose.model("PasswordResetOtp", passwordResetOtpSchema);
