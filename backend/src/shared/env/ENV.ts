import "dotenv/config";
import { AppError } from "../error/AppError";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new AppError(`Missing environment variable: ${name}`,500);
  }

  return value;
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
};