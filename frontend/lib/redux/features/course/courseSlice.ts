import { createSlice } from "@reduxjs/toolkit";


interface Chapter {
  _id: string;
  title: string;
  serialNumber: number;
  courseId: string;
  contents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AddReviewRequest {
  courseId: string;
  rating: number;
  review: string;
}
interface CourseRating {
  userId: string;
  userName: string;
  rating: number;
  review: string;
  createdAt: Date;
}
export interface Course {
  id: string;
  title: string;
  description: string;
  enrolledStudents: string[];
  price: number;
  offerPrice: number;
  instructor: string;
  instructorProfileImage: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  chapters: Chapter[];
  isPublished: boolean;
  status: string;
  rating: CourseRating[];
  createdAt: string;
  updatedAt: string;
  instructorTitle?: string;
  courseProgress?: Record<string, number>;
}

const initialState = {
  course: [] as Course[],
  singleCourse: {} as Course,
};

export const courseSlice = createSlice({
    name:"course",
    initialState,
    reducers:{
        setCourses:(state,action)=>{
            state.course.push(...action.payload);
        }
    }
})

export const { setCourses } = courseSlice.actions;
export const courseReducer = courseSlice.reducer;