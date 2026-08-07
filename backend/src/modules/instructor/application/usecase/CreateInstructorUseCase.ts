import { InstructorRepository } from "../../domain/repositories/InstructorRepository";
import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRequestDTO } from "../dto/InstructorDTO";
import { AppError } from "../../../../shared/error/AppError";
import bcrypt from "bcrypt";

export class CreateInstructorUseCase {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(
    data: InstructorRequestDTO,
    profileImage: string | undefined,
  ): Promise<Instructor> {
    
    const body: InstructorRequestDTO = data;

    if (!profileImage) {
      throw new AppError("Image not found", 400);
    }
    console.log(profileImage);
    

    if (body.password !== body.confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    // check email already exists
    const email = await this.instructorRepository.findByEmail(body.email);
    if (email) {
      throw new AppError("Email already exists", 400);
    }

    // check phone already exists
    const phone = await this.instructorRepository.findByMobileNumber(
      body.phone,
    );
    if (phone) {
      throw new AppError("Phone number already exists", 400);
    }

    const hashed = await bcrypt.hash(body.password, 10);
    const instructor = new Instructor(
      body.name,
      body.email,
      body.phone,
      body.instructorTitle,
      body.about,
      hashed,
      body.isFeatured,
      body.verifyByDefault,
      profileImage,

    );
    console.log(instructor);
    

    return this.instructorRepository.createInstructor(instructor);
  }
}
