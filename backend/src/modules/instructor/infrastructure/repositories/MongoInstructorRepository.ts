import { InstructorRequestDTO } from "../../application/dto/InstructorDTO";
import { Instructor } from "../../domain/entities/Instructor";
import { InstructorRepository } from "../../domain/repositories/InstructorRepository";
import { InstructorModel } from "../models/InstructorModel";

export class MongoInstructorRepository implements InstructorRepository {
  async createInstructor(data: InstructorRequestDTO): Promise<Instructor> {
    return (await InstructorModel.create(data)) as unknown as Instructor;
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    return await InstructorModel.findOne({ email });
  }

  async findByMobileNumber(mobileNumber: string): Promise<Instructor | null> {
    return await InstructorModel.findOne({ phone: mobileNumber });
  }

  async findAll(): Promise<Instructor[]> {
    const instructors = (await InstructorModel.find().lean()) as any[];

    return instructors.map((instructor: any) => ({
      ...instructor,
      _id: String(instructor._id),
      rating: Array.isArray(instructor.rating)
        ? instructor.rating.map((item: any) => ({
            userId: item.userId ?? "",
            rating: item.rating ?? 0,
            review: item.review ?? "",
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          }))
        : [],
    })) as unknown as Instructor[];
  }

  async getPaginatedInstructors(
    page: number,
    limit: number,
    searchTerm?: string,
  ): Promise<{ instructors: any[]; totalInstructors: number }> {
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.max(1, Math.floor(limit));
    const skip = (safePage - 1) * safeLimit;
    const trimmedSearchTerm = searchTerm?.trim();

    let searchFilter: Record<string, unknown> = {};

    if (trimmedSearchTerm) {
      const escapedSearchTerm = trimmedSearchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      searchFilter = {
        $or: [
          { name: { $regex: escapedSearchTerm, $options: "i" } },
          { email: { $regex: escapedSearchTerm, $options: "i" } },
          { instructorTitle: { $regex: escapedSearchTerm, $options: "i" } },
        ],
      };
    }

    const [rawInstructors, totalInstructors] = await Promise.all([
      InstructorModel.find(searchFilter)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      InstructorModel.countDocuments(searchFilter),
    ]);

    const instructors = (rawInstructors as any[]).map((instructor: any) => ({
      ...instructor,
      _id: String(instructor._id),
      rating: Array.isArray(instructor.rating)
        ? instructor.rating.map((item: any) => ({
            userId: item.userId ?? "",
            rating: item.rating ?? 0,
            review: item.review ?? "",
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          }))
        : [],
    })) as unknown as any[];

    return {
      instructors,
      totalInstructors,
    } as { instructors: any[]; totalInstructors: number };
  }

  async findById(id: string): Promise<Instructor | null> {
    return await InstructorModel.findById(id);
  }

  async deleteInstructor(id: string): Promise<void> {
    await InstructorModel.findByIdAndDelete(id);
  }

  async updateStatus(id: string, status: string): Promise<Instructor> {
    const instructor = await InstructorModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!instructor) {
      throw new Error("Instructor not found");
    }

    return instructor as unknown as Instructor;
  }

  async updateInstructor(id: string, data: InstructorRequestDTO, image?: string): Promise<Instructor> {
    const instructor = await InstructorModel.findByIdAndUpdate(
      id,
      {
        ...data,
        ...(image ? { profileImage: image } : {}),
      },
      { new: true },
    );

    if (!instructor) {
      throw new Error("Instructor not found");
    }

    return instructor as unknown as Instructor;
  }
}
