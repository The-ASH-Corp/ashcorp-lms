import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
    name:"category",
    initialState:[],
    reducers:{
        allCategories: (state:any, action:any) => {
            state.push(...action.payload);
        },
    }
})

export const {allCategories} = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;