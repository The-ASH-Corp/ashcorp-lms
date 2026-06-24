import jwt from "jsonwebtoken";
import { ENV } from "../env/ENV";


export const generateToken = (user: any) => {
    return jwt.sign({ id: user._id }, ENV.JWT_SECRET as string, { expiresIn: "1h" });
}