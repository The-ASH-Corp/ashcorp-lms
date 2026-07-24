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

  async getPaginatedCourses(page: number, limit: number): Promise<{ courses: Course[]; totalCourses: number; }> {
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.max(1, Math.floor(limit));
    const skip = (safePage - 1) * safeLimit;

    const [courses, totalCourses] = await Promise.all([
      CourseModel.find().skip(skip).limit(safeLimit),
      CourseModel.countDocuments(),
    ]);

    return {
      courses: courses as unknown as Course[],
      totalCourses,
    };
  }

  async getCourseById(id: string): Promise<Course> {
    const course = await CourseModel.findById(id).populate("chapters");
    return course as Course;
  }

  async updateCourse(id: string, data: any): Promise<Course> {
    const course = await CourseModel.findByIdAndUpdate(id, data, { new: true });
    return course as Course;
  }

  async addChapterToCourse(
    courseId: string,
    chapterId: string,
  ): Promise<Course> {
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      { $addToSet: { chapters: chapterId } },
      { new: true },
    );
    return course as Course;
  }

  async removeChapterFromCourse(courseId: string, chapterId: string): Promise<Course> {
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      { $pull: { chapters: chapterId } },
      { new: true },
    );
    return course as Course;
  }

  async addEnrolledStudent(
    courseId: string,
    studentId: string,
  ): Promise<Course> {
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

  async addReview(
    courseId: string,
    userId: string,
    rating: number,
    review: string,
  ): Promise<Course> {
    const course = await CourseModel.findById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    const alreadyReviewed = course.rating.find(
      (item) => item.userId === userId,
    );

    if (alreadyReviewed) {
      throw new Error("You have already reviewed this course");
    }

    course.rating.push({
      userId,
      rating,
      review,
      createdAt: new Date(),
    });

    await course.save();

    return course as unknown as Course;
  }
}
