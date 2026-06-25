import jwt from "jsonwebtoken";
import { ENV } from "../env/ENV";

type TokenSubject = string | { toString(): string };

export const generateToken = (userId: TokenSubject): string => {
  return jwt.sign({ id: userId.toString() }, ENV.JWT_SECRET as string, { expiresIn: "1h" });
};
