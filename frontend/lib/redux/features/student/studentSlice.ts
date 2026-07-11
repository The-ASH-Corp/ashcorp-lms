import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Student } from "./studentApi";

interface StudentState {
  allStudents: Student[];
}

const initialState: StudentState = {
  allStudents: [],
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    getAllStudents: (state, action: PayloadAction<Student[]>) => {
      state.allStudents = action.payload;
    },
  },
});

export const { getAllStudents } = studentSlice.actions;
export const studentReducer = studentSlice.reducer;
