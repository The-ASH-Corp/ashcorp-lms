import { AppError } from "../../../../shared/error/AppError";
import { User } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";

export class RemoveFromWishlistUseCase {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async execute(studentId: string, courseId: string): Promise<User> {
        const user = await this.userRepository.findById(studentId);

        if (!user) {
            throw new AppError("Student not found", 404);
        }

        if (!user.wishlist.includes(courseId)) {
            throw new AppError("Course not found in wishlist", 404);
        }

        const wishlist = user.wishlist.filter((id) => id !== courseId);

        return await this.userRepository.update(studentId, { wishlist });
    }
}