import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChapterState{
    chapters:Chapter[]
    message:string
    isLoading:boolean
    isSuccess:boolean
    isError:boolean
}
interface Chapter {
  _id: string;
  title: string;
  courseId: string;
  description: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

const initialState:ChapterState={
    chapters:[],
    message:"",
    isLoading:false,
    isSuccess:false,
    isError:false
}

const chapterSlice = createSlice({
    name:"chapter",
    initialState,
    reducers:{
        setChapters:(state,action:PayloadAction<Chapter[]>)=>{
            state.chapters = action.payload
        }
    }
})

export const {setChapters} = chapterSlice.actions;
export const chapterReducer = chapterSlice.reducer;