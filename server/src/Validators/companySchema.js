import Joi from "joi";

// Create Company Schema
export const createCompanySchema = {
  body: Joi.object({
    companyName: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    industry: Joi.string().trim().min(2).max(50).required(),
    address: Joi.string().trim().min(5).max(200).required(),
    numberOfEmployees: Joi.string(),
    companyEmail: Joi.string().email().required(),
  }),
};

// Update Company Data Schema
export const updateCompanyDataSchema = {
  body: Joi.object({
    companyName: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().min(10).max(1000),
    industry: Joi.string().trim().min(2).max(50),
    address: Joi.string().trim().min(5).max(200),
    numberOfEmployees: Joi.string(),
    companyEmail: Joi.string().email(),
  }).min(1),
};

// Soft Delete Company Schema
export const softDeleteCompanySchema = {
  params: Joi.object({
    companyId: Joi.string().hex().length(24).required(),
  }),
};

// Get Specific Company Data Schema
export const getSpecificCompanyDataSchema = {
  params: Joi.object({
    companyId: Joi.string().hex().length(24).required(),
  }),
};

// Search Companies By Name Schema
export const searchCompaniesByNameSchema = {
  query: Joi.object({
    companyName: Joi.string().trim().min(1).required(),
  }),
};

// Upload Company Logo Schema
export const uploadCompanyLogoSchema = {
  params: Joi.object({
    companyId: Joi.string().hex().length(24).required(),
  }),
  file: Joi.object().required(),
};

// Upload Company Cover Image Schema
export const uploadCompanyCoverImageSchema = {
  params: Joi.object({
    companyId: Joi.string().hex().length(24).required(),
  }),
  file: Joi.object().required(),
};

// Delete Company Logo Schema
export const deleteCompanyLogoSchema = {
  params: Joi.object({
    companyId: Joi.string().hex().length(24).required(),
  }),
};

// Delete Company Cover Image Schema
export const deleteCompanyCoverImageSchema = {
  params: Joi.object({
    companyId: Joi.string().hex().length(24).required(),
  }),
};
