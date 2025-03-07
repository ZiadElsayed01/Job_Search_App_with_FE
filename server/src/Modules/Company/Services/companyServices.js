import { Company } from "../../../DB/Models/companyModel.js";
import { User } from "../../../DB/Models/userModel.js";
import { roles } from "../../../Constants/constants.js";
import { cloudinaryConfig } from "../../../Config/cloudinaryConfig.js";
import { upload } from "../../../utils/uploadFiles.js";

// Create Company
export const createCompany = async (req, res) => {
  const { _id } = req.loggedInUser;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  if (
    !companyName ||
    !description ||
    !industry ||
    !address ||
    !numberOfEmployees ||
    !companyEmail
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingCompany = await Company.findOne({
    $or: [{ companyEmail }, { companyName }],
  });

  if (existingCompany) {
    return res.status(400).json({ message: "Company already exists" });
  }

  const user = await User.findById(_id);
  user.role = roles.USER_OWNER;

  await user.save();

  const company = new Company({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    CreatedBy: _id,
  });

  await company.save();

  res.status(201).json({ message: "Company created successfully", company });
};

// Update Company Data
export const updateCompanyData = async (req, res) => {
  const { companyId } = req.params;
  const { file } = req;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (req.file) {
    if (!company.approvedByAdmin) {
      if (company.legalAttachment?.public_id) {
        await cloudinaryConfig().uploader.destroy(
          company.legalAttachment?.public_id
        );
      }
      const { secure_url, public_id } = await upload(
        file,
        "Companies/LegalAttachments"
      );
      company.legalAttachment = { secure_url, public_id };
    } else {
      return res.status(400).json({
        message: "You are not allowed to update the legalAttachment field",
      });
    }
  }

  const existingCompany = await Company.findOne({
    $or: [{ companyEmail }, { companyName }],
    _id: { $ne: companyId },
  });

  if (existingCompany) {
    return res.status(400).json({
      message: "Company name or email already exists for another company",
    });
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json({ message: "Company updated successfully", updatedCompany });
};

// Soft Delete Company
export const softDeleteComapany = async (req, res) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  company.deleted = true;
  company.deletedAt = new Date();

  await company.save();

  res.status(200).json({ message: "Company soft deleted successfully" });
};

// Get Specific Company Data
export const getSpecificCompanyData = async (req, res) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId).populate("jobs");

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  res.status(200).json({ message: "Company found successfully", company });
};

// Search Companies By Name
export const searchCompaniesByName = async (req, res) => {
  const { companyName } = req.query;

  const companies = await Company.find({
    companyName: { $regex: new RegExp(companyName, "i") },
    deleted: false,
  });

  if (!companies.length) {
    return res.status(404).json({ message: "Company not found" });
  }

  res.status(200).json({ message: "Company fetched successfully", companies });
};

// Upload Company Logo
export const uploadCompanyLogo = async (req, res) => {
  const { companyId } = req.params;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (company.Logo?.public_id) {
    await cloudinaryConfig().uploader.destroy(company.Logo.public_id);
  }

  const { secure_url, public_id } = await upload(file, "Companies/Logos");
  company.Logo = { secure_url, public_id };
  await company.save();

  res.status(200).json({ message: "Company logo uploaded successfully" });
};

// Upload Company Cover Image
export const uploadCompanyCoverImage = async (req, res) => {
  const { companyId } = req.params;
  const { file } = req;

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (company.coverPic?.public_id) {
    await cloudinaryConfig().uploader.destroy(company.coverPic.public_id);
  }

  const { secure_url, public_id } = await upload(file, "Companies/Covers");
  company.coverPic = { secure_url, public_id };
  await company.save();

  res
    .status(200)
    .json({ message: "Company cover image uploaded successfully" });
};

// Delete Company Logo
export const deleteCompanyLogo = async (req, res) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (!company.Logo) {
    return res.status(404).json({ message: "Company logo not found" });
  }

  await cloudinaryConfig().uploader.destroy(company.Logo.public_id);
  company.Logo = undefined;
  await company.save();

  res.status(200).json({ message: "Company logo deleted successfully" });
};

// Delete Company Cover Image
export const deleteCompanyCoverImage = async (req, res) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (!company.coverPic) {
    return res.status(404).json({ message: "Company cover image not found" });
  }

  await cloudinaryConfig().uploader.destroy(company.coverPic.public_id);
  company.coverPic = undefined;
  await company.save();

  res.status(200).json({ message: "Company cover image deleted successfully" });
};
