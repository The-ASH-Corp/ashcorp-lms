import { User } from "../../domain/entities/User";
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

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users;
  }

  async hasPurchasedCourse(courseId: string): Promise<boolean> {
    const studentCount = await UserModel.countDocuments({
      role: "user",
      purchasedCourses: courseId,
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
