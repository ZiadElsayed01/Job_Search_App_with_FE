import mongoose from "mongoose";
import { numberOfEmployees } from "../../Constants/constants.js";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: {
      type: String,
      enum: Object.values(numberOfEmployees),
      required: true,
    },
    companyEmail: { type: String, unique: true, required: true },
    CreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Logo: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    coverPic: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    HRs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bannedAt: { type: Date, default: null },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    legalAttachment: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    approvedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

companySchema.virtual("jobs", {
  ref: "JobOpportunity",
  localField: "_id",
  foreignField: "companyId",
});

companySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const companyId = this._id;

    // Delete all job opportunities associated with the company
    await mongoose.model("JobOpportunity").deleteMany({ companyId });

    // Remove the company reference from users who are HRs
    await mongoose
      .model("User")
      .updateMany({ company: companyId }, { $unset: { company: "" } });

    next();
  }
);

export const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);
