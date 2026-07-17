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

    async findById(id: string): Promise<Admin | null> {
        const admin = await AdminModel.findById(id);
        return admin;
    }

    async findByIdWithPassword(id: string): Promise<Admin | null> {
        const admin = await AdminModel.findById(id).select("+password");
        return admin;
    }

    async update(id: string, data: Partial<Admin>): Promise<Admin> {
        const admin = await AdminModel.findByIdAndUpdate(id, data, { new: true });
        if (!admin) {
            throw new Error("Admin not found");
        }
        return admin;
    }
}
