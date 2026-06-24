import "dotenv/config"

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  FRONTEND_URL: process.env.FRONTEND_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};