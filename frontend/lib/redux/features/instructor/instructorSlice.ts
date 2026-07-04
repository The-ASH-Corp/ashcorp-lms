import { createSlice } from "@reduxjs/toolkit";

interface InstructorState {
    instructor: null,
    allInstructors: [],
    isError: boolean,
    isSuccess: boolean,
    isLoading: boolean,
    message: string
}
const initialState:InstructorState = {
    instructor:null,
    allInstructors:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:""
}

const instructorSlice = createSlice({
    name: "instructor",
    initialState,
    reducers: {
        getAllInstructors:(state, action) => {
            state.allInstructors = action.payload;
        }
    }
})

export const {getAllInstructors} = instructorSlice.actions;
export const instructorReducer = instructorSlice.reducer;