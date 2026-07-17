import { createSlice } from "@reduxjs/toolkit";

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  offerPrice: number;
  instructor: string;
  instructorTitle: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  chapters: string[];
  isPublished: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
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