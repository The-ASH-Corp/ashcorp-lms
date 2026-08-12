import mongoose, { InferSchemaType } from "mongoose";

const graduateSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    featureOnLandingPage: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export type GraduateDocument = InferSchemaType<typeof graduateSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export const GraduateModel = mongoose.model("Graduate", graduateSchema);
