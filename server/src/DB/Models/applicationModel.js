import mongoose from "mongoose";
import { applicationStatus } from "../../Constants/constants.js";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobOpportunity",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userCV: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    status: {
      type: String,
      enum: Object.values(applicationStatus),
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
