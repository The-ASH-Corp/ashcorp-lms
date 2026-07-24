import { ExamAttempt, User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserModel } from "../models/UserModel";
import { RegisterDTO } from "../../../auth/application/dto/RegisterDTO";
import bcrypt from "bcrypt";

export class MongoUserRepository implements UserRepository {


  async create(data: RegisterDTO): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = await UserModel.create({
      ...data,
      password: hashedPassword,
      role: "user",
      status: "Active",
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).select("+password");
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user;
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).select("+password");
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async saveExamAttempt(id: string, attempt: ExamAttempt): Promise<User> {
    const update: Record<string, unknown> = {
      $push: { examAttempts: attempt },
    };

    const user = await UserModel.findByIdAndUpdate(id, update, { new: true });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users;
  }

  async getPaginatedStudents(
    page: number,
    limit: number,
    searchTerm?: string,
  ): Promise<{ students: User[]; totalStudents: number }> {
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.max(1, Math.floor(limit));
    const skip = (safePage - 1) * safeLimit;
    const trimmedSearchTerm = searchTerm?.trim();

    let searchFilter: Record<string, unknown> = { role: "user" };

    if (trimmedSearchTerm) {
      const escapedSearchTerm = trimmedSearchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const orConditions: Array<Record<string, unknown>> = [
        { name: { $regex: escapedSearchTerm, $options: "i" } },
        { email: { $regex: escapedSearchTerm, $options: "i" } },
      ];

      const searchNum = Number(trimmedSearchTerm);
      if (!Number.isNaN(searchNum)) {
        orConditions.push({ phone: searchNum });
      }

      searchFilter = {
        role: "user",
        $or: orConditions,
      };
    }

    const [students, totalStudents] = await Promise.all([
      UserModel.find(searchFilter)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(safeLimit),
      UserModel.countDocuments(searchFilter),
    ]);

    return {
      students,
      totalStudents,
    };
  }

  async hasPurchasedCourse(courseId: string): Promise<boolean> {
    const studentCount = await UserModel.countDocuments({
      role: "user",
      "purchasedCourses.courseId": courseId,
    });

    return studentCount > 0;
  }

  async removeCourseFromWishlists(courseId: string): Promise<void> {
    await UserModel.updateMany(
      { wishlist: courseId },
      { $pull: { wishlist: courseId } },
    );
  }
}
