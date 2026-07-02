import { RegisterDTO } from "../../../auth/application/dto/RegisterDTO";
import { Admin } from "../../domain/entities/Admin";
import { AdminRepository } from "../../domain/repositories/AdminRepository";
import { AdminModel } from "../models/AdminModel";

export class MongoAdminRepository implements AdminRepository {

    async create(data: RegisterDTO): Promise<Admin> {
        const admin = await AdminModel.create(data);
        return admin;
    }

    async findByEmail(email: string): Promise<Admin | null> {
        const admin = await AdminModel.findOne({ email }).select("+password");
        return admin;
    }
}