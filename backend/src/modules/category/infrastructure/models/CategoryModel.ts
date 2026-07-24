import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    iconUrl: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const CategoryModel = mongoose.model("Category", categorySchema);
