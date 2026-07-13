import { AppError } from "../../../../shared/error/AppError";
import { User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export class BlockStudentUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("Student not found", 404);
    }

    const nextStatus = user.status === "Inactive" ? "Active" : "Inactive";

    return await this.userRepository.update(id, { status: nextStatus });
  }
}
