import { AppError } from "../../../../shared/error/AppError";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export class DeleteStudentUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("Student not found", 404);
    }

    await this.userRepository.delete(id);
  }
}
