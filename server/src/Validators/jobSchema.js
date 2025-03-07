import Joi from "joi";
import {
  jobLocation,
  seniorityLevel,
  workingTime,
  applicationStatus,
} from "../Constants/constants.js";

// Create Job Schema
export const createJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().trim().min(2).max(100).required(),
    jobLocation: Joi.string()
      .valid(...Object.values(jobLocation))
      .required(),
    workingTime: Joi.string()
      .valid(...Object.values(workingTime))
      .required(),
    seniorityLevel: Joi.string()
      .valid(...Object.values(seniorityLevel))
      .required(),
    jobDescription: Joi.string().trim().min(10).max(1000).required(),
    technicalSkills: Joi.array().items(Joi.string()).min(1).required(),
    softSkills: Joi.array().items(Joi.string()).min(1).required(),
  }),
};

// Update Job Schema
export const updateJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().trim().min(2).max(100),
    jobLocation: Joi.string().valid(...Object.values(jobLocation)),
    workingTime: Joi.string().valid(...Object.values(workingTime)),
    seniorityLevel: Joi.string().valid(...Object.values(seniorityLevel)),
    jobDescription: Joi.string().trim().min(10).max(1000),
    technicalSkills: Joi.array().items(Joi.string()).min(1),
    softSkills: Joi.array().items(Joi.string()).min(1),
  }).min(1),
};

// Delete Job Schema
export const deleteJobSchema = {
  params: Joi.object({
    jobId: Joi.string().hex().length(24).required(),
  }),
};

// get jobs by company name
export const getJobsByCompanyNameSchema = {
  params: Joi.object({
    companyName: Joi.string().trim().required(),
  }),
};

// Get Jobs by Filters Schema
export const getJobsByFiltersSchema = {
  body: Joi.object({
    workingTime: Joi.string().valid(...Object.values(workingTime)),
    jobLocation: Joi.string().valid(...Object.values(jobLocation)),
    seniorityLevel: Joi.string().valid(...Object.values(seniorityLevel)),
    jobTitle: Joi.string().trim().min(2).max(100),
    technicalSkills: Joi.array().items(Joi.string()).min(1),
  }),
};

// Get Job Applications Schema
export const getJobApplicationsSchema = {
  params: Joi.object({
    jobId: Joi.string().hex().length(24).required(),
  }),
};

// Apply to job
export const applyToJobSchema = {
  params: Joi.object({
    jobId: Joi.string().hex().length(24).required(),
  }),
  file: Joi.object().required(),
};

// Update Application Status Schema
export const updateApplicationStatusSchema = {
  body: Joi.object({
    status: Joi.string()
      .valid(...Object.values(applicationStatus))
      .required(),
  }),
};
