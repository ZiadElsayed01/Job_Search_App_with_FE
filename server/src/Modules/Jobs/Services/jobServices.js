import { Application } from "../../../DB/Models/applicationModel.js";
import { Company } from "../../../DB/Models/companyModel.js";
import { JobOpportunity } from "../../../DB/Models/jobModel.js";
import { User } from "../../../DB/Models/userModel.js";
import { sendEmail } from "../../../Services/sendEmail.js";
import { io } from "../../../main.js";
import { upload } from "../../../utils/uploadFiles.js";

// Create Job
export const createJob = async (req, res) => {
  const { _id } = req.loggedInUser;
  const { companyId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (
    company.CreatedBy?.toString() !== _id?.toString() &&
    !company.HRs?.includes(_id?.toString())
  ) {
    return res
      .status(403)
      .json({ message: "Unauthorized: Only Owner or HR can create job" });
  }

  const job = await JobOpportunity.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: _id,
    companyId: companyId,
  });

  res.status(200).json({ message: "Job created successfully", job });
};

// Update Job
export const updateJob = async (req, res) => {
  const { _id } = req.loggedInUser;
  const { jobId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  const job = await JobOpportunity.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  // Find the company associated with the job
  const company = await Company.findById(job.companyId);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  // Check if the user is the owner of the company
  if (company.CreatedBy.toString() !== _id.toString()) {
    return res.status(403).json({
      message: "Unauthorized: Only the company owner can update this job",
    });
  }

  const updatedJob = await JobOpportunity.findByIdAndUpdate(
    jobId,
    {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
    },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Job updated successfully", job: updatedJob });
};

// Delete Job
export const deleteJob = async (req, res) => {
  const { _id } = req.loggedInUser;
  const { jobId } = req.params;

  const job = await JobOpportunity.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  // Find the company associated with the job
  const company = await Company.findById(job.companyId);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  // Check if the user is the owner of the company
  if (!company.HRs.includes(_id.toString())) {
    return res.status(403).json({
      message: "Unauthorized: Only HR can delete this job",
    });
  }

  await JobOpportunity.findByIdAndDelete(jobId);
  res.status(200).json({ message: "Job deleted successfully" });
};

// Get All Jobs or specific job for specific company
export const getJobsByCompanyName = async (req, res) => {
  const { companyName } = req.params;
  const { jobId } = req.params;
  const { page, limit } = req.query;

  const company = await Company.find({
    companyName: { $regex: new RegExp(companyName, "i") },
  });
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (jobId) {
    const job = await JobOpportunity.findOne({
      _id: jobId,
      companyId: company._id,
    });
    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found for this company" });
    }
    return res.status(200).json({ message: "Job found successfully", job });
  }

  const jobs = await JobOpportunity.paginate(
    {
      companyId: { $in: company.map((c) => c._id) },
    },
    {
      limit,
      page,
      sort: { createdAt: -1 },
      customLabels: {
        docs: "jobs",
      },
    }
  );

  res.status(200).json({ message: "Jobs found successfully", jobs });
};

// Get all Jobs that match the following filters and if no filters apply then get all jobs
export const getJobsByFilters = async (req, res) => {
  const { page, limit } = req.query;
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.body;

  const query = {};

  if (workingTime) {
    query.workingTime = workingTime;
  }

  if (jobLocation) {
    query.jobLocation = jobLocation;
  }

  if (seniorityLevel) {
    query.seniorityLevel = seniorityLevel;
  }

  if (jobTitle) {
    query.jobTitle = { $regex: new RegExp(jobTitle, "i") };
  }

  if (technicalSkills && technicalSkills.length > 0) {
    query.technicalSkills = { $in: technicalSkills };
  }

  const jobs = await JobOpportunity.paginate(query, {
    limit,
    page,
    sort: { createdAt: -1 },
    customLabels: {
      docs: "jobs",
    },
  });

  if (jobs.jobs.length === 0) {
    const allJobs = await JobOpportunity.find();
    return res
      .status(200)
      .json({ message: "All jobs found successfully", allJobs });
  }
  res.status(200).json({ message: "Jobs found successfully", jobs });
};

// Get all applications for specific Job.
export const getJobApplications = async (req, res) => {
  const { jobId } = req.params;
  const { page = 1, limit } = req.query;
  const { _id } = req.loggedInUser;

  const job = await JobOpportunity.findById(jobId).populate({
    path: "companyId",
    select: "CreatedBy HRs",
  });

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const isAuthorized =
    job.companyId.CreatedBy?.toString() === _id?.toString() ||
    job.companyId.HRs?.includes(_id?.toString());

  if (!isAuthorized) {
    return res.status(403).json({
      message: "Unauthorized: only owner or HR can view applications",
    });
  }

  const applications = await Application.paginate(
    { jobId },
    {
      limit,
      page,
      sort: { createdAt: -1 },
      populate: {
        path: "userId",
        select: "firstName lastName email mobileNumber",
      },
      customLabels: {
        docs: "applications",
      },
    }
  );

  res
    .status(200)
    .json({ message: "Applications found successfully", applications });
};

// Apply to a job
export const applyToJob = async (req, res) => {
  const { jobId } = req.params;
  const { _id } = req.loggedInUser;
  const { file } = req;

  const job = await JobOpportunity.findById(jobId).populate("companyId");

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  // Check if the user has already applied to the job
  const existingApplication = await Application.findOne({
    jobId,
    userId: _id,
  });
  if (existingApplication) {
    return res
      .status(400)
      .json({ message: "You have already applied to this job" });
  }

  if (!file) {
    return res.status(400).json({ message: "Please upload a CV" });
  }

  const { secure_url, public_id } = await upload(file, "CVs");

  // Create a new job application
  const application = await Application.create({
    jobId,
    userId: _id,
    userCV: { secure_url, public_id },
  });

  // Emit a socket event to notify HR
  io.to(job.companyId._id.toString()).emit("newApplication", {
    message: "New job application received",
    jobId,
    userId: _id,
    applicationId: application._id,
  });

  res
    .status(201)
    .json({ message: "Application submitted successfully", application });
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  const { _id } = req.loggedInUser;

  // Find the application
  const application = await Application.findById(applicationId).populate({
    path: "jobId",
    populate: { path: "companyId" },
  });

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  // Check if the user is an HR for the company
  const isHR = application.jobId.companyId.HRs.includes(_id);
  if (!isHR) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Update the application status
  application.status = status;
  await application.save();

  // Send email to the applicant
  const user = await User.findById(application.userId);

  sendEmail.emit("SendEmail", {
    to: user.email,
    subject: `Your Application Status - ${application.jobId.jobTitle}`,
    html: `Your application for the job "${application.jobId.jobTitle}" has been ${status}.`,
  });

  res
    .status(200)
    .json({ message: `Application ${status} successfully`, application });
};
