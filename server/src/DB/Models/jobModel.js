import mongoose from "mongoose";
import {
  jobLocation,
  seniorityLevel,
  workingTime,
} from "../../Constants/constants.js";
import mongoosePagination from "mongoose-paginate-v2";

const jobOpportunitySchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocation),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTime),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevel),
      required: true,
    },
    jobDescription: { type: String, required: true },
    technicalSkills: { type: [String], required: true },
    softSkills: { type: [String], required: true },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    closed: { type: Boolean, default: false },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

jobOpportunitySchema.plugin(mongoosePagination);

jobOpportunitySchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});

jobOpportunitySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const jobId = this._id;

    // Delete all applications associated with the job
    await mongoose.model("Application").deleteMany({ jobId });

    next();
  }
);

export const JobOpportunity =
  mongoose.models.JobOpportunity ||
  mongoose.model("JobOpportunity", jobOpportunitySchema);
