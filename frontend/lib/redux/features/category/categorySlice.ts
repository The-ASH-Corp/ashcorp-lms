import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "./categoryApi";

interface CategoryState {
  allCategories: Category[];
  selectedCategory: Category | null;
}

const initialState: CategoryState = {
    allCategories:[],
    selectedCategory:null
}
export const categorySlice = createSlice({
    name:"category",
    initialState,
    reducers:{
        allCategories: (state: CategoryState, action: PayloadAction<Category[]>) => {
            state.allCategories.push(...action.payload);
        },
    }
})

export const {allCategories} = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;