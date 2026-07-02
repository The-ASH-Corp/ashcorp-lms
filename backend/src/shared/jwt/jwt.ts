import jwt from "jsonwebtoken";
import { ENV } from "../env/ENV";

type TokenSubject = string | { toString(): string };

export const generateToken = (userId: TokenSubject,role:string): string => {
  return jwt.sign({ userId: userId.toString(),role }, ENV.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};
