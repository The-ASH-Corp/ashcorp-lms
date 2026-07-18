import mongoose from "mongoose";

const questionOptionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false },
);

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["multiple-choice", "true-false"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    options: {
      type: [questionOptionSchema],
      required: true,
    },
  },
  { _id: false },
);

const examSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      ref: "Course",
    },
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    marksPerQuestion: {
      type: Number,
      required: true,
    },
    passMarks: {
      type: Number,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
  },
  { timestamps: true },
);

export const ExamModel = mongoose.model("Exam", examSchema);
