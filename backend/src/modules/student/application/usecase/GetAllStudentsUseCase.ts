import { User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export class GetAllStudentsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(options?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }): Promise<User[] | { students: User[]; totalStudents: number }> {
    if (
      options?.page !== undefined &&
      options?.limit !== undefined &&
      options.page > 0 &&
      options.limit > 0
    ) {
      return await this.userRepository.getPaginatedStudents(
        options.page,
        options.limit,
        options.searchTerm,
      );
    }
    return await this.userRepository.findAll();
  }
}
