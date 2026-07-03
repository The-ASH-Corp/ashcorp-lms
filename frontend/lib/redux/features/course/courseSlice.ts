import { createSlice } from "@reduxjs/toolkit";

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    instructor: string;
    category: string;
    level: string;
    rating: number;
    duration: string;
    language: string;
    imageUrl: string;
    videoUrl: string;
    tags: string[];
    chapters: string[];
    createdAt: string;
    updatedAt: string;
}
const initialState:Course[] = [];

export const courseSlice = createSlice({
    name:"course",
    initialState,
    reducers:{
        
    }
})

export const {} = courseSlice.actions;
export const courseReducer = courseSlice.reducer;