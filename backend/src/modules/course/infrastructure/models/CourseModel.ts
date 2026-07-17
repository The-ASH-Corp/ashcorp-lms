import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    chapters: {
      type: [String],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Active",
    },
    rating: [
      {
        userId: {
          type: String,
        },
        rating: {
          type: Number,
        },
        review: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
  },
  { timestamps: true },
);

export const CourseModel = mongoose.model("Course", courseSchema);
