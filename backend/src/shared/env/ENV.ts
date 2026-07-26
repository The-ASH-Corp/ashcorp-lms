import "dotenv/config";
import { AppError } from "../error/AppError";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new AppError(`Missing environment variable: ${name}`,500);
  }

  return value;
}

function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value || undefined;
}

function getNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}

export const ENV = {
  PORT: getEnv("PORT"),
  MONGO_URI: getEnv("MONGO_URI"),
  FRONTEND_URL: getEnv("FRONTEND_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  NODE_ENV: getEnv("NODE_ENV"),
  AWS_REGION: getEnv("AWS_REGION"),
  AWS_ACCESS_KEY: getEnv("AWS_ACCESS_KEY"),
  AWS_SECRET_KEY: getEnv("AWS_SECRET_KEY"),
  AWS_BUCKET_NAME: getEnv("AWS_BUCKET_NAME"),
  RAZORPAY_KEY_ID: getEnv("RAZORPAY_KEY_ID"),
  RAZORPAY_KEY_SECRET: getEnv("RAZORPAY_KEY_SECRET"),
  SMTP_HOST: getOptionalEnv("SMTP_HOST"),
  SMTP_PORT: getNumberEnv("SMTP_PORT", 587),
  SMTP_SECURE: getOptionalEnv("SMTP_SECURE") === "true",
  SMTP_USER: getOptionalEnv("SMTP_USER"),
  SMTP_PASS: getOptionalEnv("SMTP_PASS"),
  SMTP_FROM: getOptionalEnv("SMTP_FROM"),
  OTP_EXPIRY_MINUTES: getNumberEnv("OTP_EXPIRY_MINUTES", 10),
  OTP_MAX_ATTEMPTS: getNumberEnv("OTP_MAX_ATTEMPTS", 5),
  OTP_REQUEST_COOLDOWN_SECONDS: getNumberEnv("OTP_REQUEST_COOLDOWN_SECONDS", 60),
  OTP_REQUEST_MAX_PER_WINDOW: getNumberEnv("OTP_REQUEST_MAX_PER_WINDOW", 5),
  OTP_REQUEST_WINDOW_MINUTES: getNumberEnv("OTP_REQUEST_WINDOW_MINUTES", 15),
};