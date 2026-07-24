import { Course } from "../entities/Course";

export interface CourseRepository {
  create(data: any): Promise<Course>;

  getAllCourse(): Promise<Course[]>;

  getPaginatedCourses(page: number, limit: number): Promise<{
    courses: Course[];
    totalCourses: number;
  }>;

  getCourseById(id: string): Promise<Course>;

  updateCourse(id: string, data: any): Promise<Course>;

  addChapterToCourse(courseId: string, chapterId: string): Promise<Course>;

  removeChapterFromCourse(courseId: string, chapterId: string): Promise<Course>;

  addEnrolledStudent(courseId: string, studentId: string): Promise<Course>;

  makeCourseFreeAndPublished(id: string): Promise<Course>;

  deleteCourse(id: string): Promise<void>;
  addReview(
    courseId: string,
    userId: string,
    rating: number,
    review: string,
  ): Promise<Course>;
}
