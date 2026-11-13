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
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
    enrolledStudents: {
      type: [String],
      default: [],
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
      },
    ],
    ratingSource: {
      type: String,
      enum: ["db", "admin"],
      default: "db",
    },
    staticRating: {
      type: Number,
      default: 0,
    },
    staticRatingCount: {
      type: Number,
      default: 0,
    },
    staticEnrolledCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const CourseModel = mongoose.model("Course", courseSchema);
