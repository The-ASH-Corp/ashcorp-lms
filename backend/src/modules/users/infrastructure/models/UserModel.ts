import mongoose from "mongoose";

const examAnswerSchema = new mongoose.Schema(
  {
    questionIndex: {
      type: Number,
      required: true,
    },
    selectedOptionIndex: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false },
);

const examAttemptSchema = new mongoose.Schema(
  {
    examId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    answers: {
      type: [examAnswerSchema],
      default: [],
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passMarks: {
      type: Number,
      required: true,
    },
    isPassed: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "stopped"],
      required: true,
    },
    reason: {
      type: String,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const certificateSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const purchasedCourseSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    paymentId: { type: String, required: true },
    methodOfPayment: { type: String, default: "razorpay" },
    paymentTime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  wishlist: {
    type: [String],
    default: [],
  },
  purchasedCourses: {
    type: [purchasedCourseSchema],
    default: [],
  },
  courseProgress: {
    type: Map,
    of: Number,
    default: {},
  },
  certificates: {
    type: [certificateSchema],
    default: [],
  },
  examAttempts: {
    type: [examAttemptSchema],
    default: [],
  },
});

export const UserModel = mongoose.model("User", userSchema);
