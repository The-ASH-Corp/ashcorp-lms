import mongoose from "mongoose";
import { ENV } from "../env/ENV";

export const connectDB = async (): Promise<void> => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(ENV.MONGO_URI);

    console.info("Connected to MongoDB");

  } catch (error) {
    console.error(error);
    throw error;
  }
};