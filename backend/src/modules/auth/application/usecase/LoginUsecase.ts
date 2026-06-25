import { AppError } from "../../../../shared/error/AppError";
import { generateToken } from "../../../../shared/jwt/jwt";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { LoginDTO } from "../dto/LoginDTO";
import bcrypt from "bcrypt";

export class LoginUsecase {
  constructor(private readonly userRepository: UserRepository) {}
  
  async execute(body: LoginDTO): Promise<LoginResponse> {

  const { email, password } = body;
  const user = await this.userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user._id) {
    throw new AppError("User id is missing", 500);
  }

  // Generate a token 
  const token = generateToken(user._id);

  return {token:token, user:{ name:user.name, email:user.email, phone:user.phone}};

  }
}

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    phone: number;
  };
}