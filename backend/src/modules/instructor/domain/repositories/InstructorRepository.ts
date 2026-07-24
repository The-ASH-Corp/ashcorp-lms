import { InstructorRequestDTO } from "../../application/dto/InstructorDTO";
import { Instructor } from "../entities/Instructor";

export interface InstructorRepository {

  createInstructor(data: InstructorRequestDTO): Promise<Instructor>;

  findByEmail(email: string): Promise<Instructor | null>;

  findByMobileNumber(mobileNumber: string): Promise<Instructor | null>;

  findAll(): Promise<Instructor[]>;

  findById(id: string): Promise<Instructor | null>;

  deleteInstructor(id: string): Promise<void>;

  updateStatus(id: string, status: string): Promise<Instructor>;

  updateInstructor(id: string, data: InstructorRequestDTO, image?: string): Promise<Instructor>;
}
