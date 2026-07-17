import { Course } from "../../domain/entities/Course";
import { CourseRepository } from "../../domain/repositories/CourseRepository";
import { CourseModel } from "../models/CourseModel";

export class MongoCourseRepository implements CourseRepository {
    
  async create(data: any): Promise<Course> {
    const course = await CourseModel.create(data);
    return course as unknown as Course;
  }

  async getAllCourse(): Promise<Course[]> {
    const course = await CourseModel.find();
    return course as unknown as Course[];
  }

  async getCourseById(id: string): Promise<Course> {
    const course = await CourseModel.findById(id);
    return course as Course;
  }

  async updateCourse(id: string, data: any): Promise<Course> {
    const course = await CourseModel.findByIdAndUpdate(id, data, { new: true });
    return course as Course;
  }

  async addEnrolledStudent(courseId: string, studentId: string): Promise<Course> {
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: studentId } },
      { new: true },
    );
    return course as Course;
  }

  async makeCourseFreeAndPublished(id: string): Promise<Course> {
    const course = await CourseModel.findByIdAndUpdate(
      id,
      {
        price: 0,
        offerPrice: 0,
        isPublished: true,
        updatedAt: new Date(),
      },
      { new: true },
    );

    return course as Course;
  }

  async deleteCourse(id: string): Promise<void> {
    await CourseModel.findByIdAndDelete(id);
  }

}
