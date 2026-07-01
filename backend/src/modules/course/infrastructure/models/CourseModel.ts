import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: {
     type: String, 
     required: true 
    },
  price: {
     type: Number, 
     required: true 
    },
  instructor: {
     type: String, 
     required: true 
    },
  category: {
     type: String, 
     required: true 
    },
  level: {
     type: String, 
     required: true 
    },
  rating: {
     type: Number, 
     required: true 
    },
  duration: {
     type: String, 
     required: true 
    },
  language: {
     type: String, 
     required: true 
    },
  imageUrl: {
     type: String, 
     required: true 
    },
  videoUrl: {
     type: String, 
     required: true 
    },
  tags: {
     type: [String], 
     required: true 
    },
  chapters: {
     type: [String], 
     required: true 
    },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
     type: Date, 
     default: Date.now 
    },
});

export const CourseModel = mongoose.model("Course", courseSchema);
