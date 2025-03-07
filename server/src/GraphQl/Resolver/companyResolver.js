import { Company } from "../../DB/Models/companyModel.js";

// List all companies
export const listCompaniesResolvers = async () => {
  return await Company.find();
};

// Ban specific company
export const banCompanyResolvers = async (_, args) => {
  return await Company.findByIdAndUpdate(
    args._id,
    { bannedAt: new Date() },
    { new: true }
  );
};

// Unban specific company
export const unbanCompanyResolvers = async (_, args) => {
  return await Company.findByIdAndUpdate(
    args._id,
    { bannedAt: null },
    { new: true }
  );
};

// Approve company
export const approveCompanyResolvers = async (_, args) => {
  return await Company.findByIdAndUpdate(
    args._id,
    { approvedByAdmin: true },
    { new: true }
  );
};
