import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Instructor } from "./instructorApi";

interface InstructorState {
    instructor: Instructor | null;
    allInstructors: Instructor[];
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}
const initialState: InstructorState = {
    instructor: null,
    allInstructors: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

const instructorSlice = createSlice({
    name: "instructor",
    initialState,
    reducers: {
        getAllInstructors:(state, action: PayloadAction<Instructor[]>) => {
            state.allInstructors = action.payload;
        }
    }
})

export const {getAllInstructors} = instructorSlice.actions;
export const instructorReducer = instructorSlice.reducer;