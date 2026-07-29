import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
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
    default: "admin",
  },
  profileImage: {
    type: String,
    default: "",
  },
});

export const AdminModel = mongoose.model("Admin", adminSchema);
