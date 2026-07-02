import { RegisterDTO } from "../../../auth/application/dto/RegisterDTO";
import { Admin } from "../entities/Admin";

export interface AdminRepository {
    create(data: RegisterDTO): Promise<Admin>;

    findByEmail(email: string): Promise<Admin | null>;

    findById(id: string): Promise<Admin | null>;
}