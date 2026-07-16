import mongoose from "mongoose";

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
    type: [String],
    default: [],
  },
  certificates: {
    type: [String],
    default: [],
  },
});

export const UserModel = mongoose.model("User", userSchema);
