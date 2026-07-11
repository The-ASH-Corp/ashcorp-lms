import { AppError } from "../../../../shared/error/AppError";
import { generateToken } from "../../../../shared/jwt/jwt";
import { AdminRepository } from "../../../admins/domain/repositories/AdminRepository";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { LoginDTO } from "../dto/LoginDTO";
import bcrypt from "bcrypt";

export class LoginUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async execute(body: LoginDTO): Promise<LoginResponse> {
    const { email, password } = body;
    const user = await this.userRepository.findByEmail(email);
    const admin = await this.adminRepository.findByEmail(email);
    const authenticatedUser = user ?? admin;

    if (!authenticatedUser) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      authenticatedUser.password,
    );

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    if ("status" in authenticatedUser && authenticatedUser.status === "Inactive") {
      throw new AppError("Account is blocked", 403);
    }

    const userId = authenticatedUser._id;

    if (!userId) {
      throw new AppError("Unable to generate token", 500);
    }

    const token = generateToken(userId, authenticatedUser.role);

    return {
      token,
      user: {
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        phone: authenticatedUser.phone,
        role: authenticatedUser.role,
      },
    };
  }
}

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    phone: number;
    role: string;
  };
}
