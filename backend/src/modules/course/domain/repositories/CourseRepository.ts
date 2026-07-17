import { Course } from "../entities/Course";

export interface CourseRepository {
  create(data: any): Promise<Course>;

  getAllCourse(): Promise<Course[]>;

  getCourseById(id: string): Promise<Course>;

  updateCourse(id: string, data: any): Promise<Course>;

  addEnrolledStudent(courseId: string, studentId: string): Promise<Course>;

  makeCourseFreeAndPublished(id: string): Promise<Course>;

  deleteCourse(id:string):Promise<void>;
}
