import { Router } from "express";
import {
  applyToJob,
  createJob,
  deleteJob,
  getJobApplications,
  getJobsByCompanyName,
  getJobsByFilters,
  updateApplicationStatus,
  updateJob,
} from "./Services/jobServices.js";
import { authenticationMiddleware } from "../../Middlewares/authenticationMiddleware.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandlerMiddleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorizationMiddleware.js";
import { extension, roles } from "../../Constants/constants.js";
import { multerHost } from "../../Middlewares/multerMiddleware.js";
import { validationMiddleware } from "../../Middlewares/validationMiddleware.js";
import {
  applyToJobSchema,
  createJobSchema,
  deleteJobSchema,
  getJobApplicationsSchema,
  getJobsByCompanyNameSchema,
  getJobsByFiltersSchema,
  updateApplicationStatusSchema,
  updateJobSchema,
} from "../../Validators/jobSchema.js";
const jobsRouter = Router({
  mergeParams: true,
});

jobsRouter.use(errorHandlerMiddleware(authenticationMiddleware()));

// create job
jobsRouter.post(
  "/create-job/:companyId",
  validationMiddleware(createJobSchema),
  authorizationMiddleware([roles.HR, roles.USER_OWNER]),
  errorHandlerMiddleware(createJob)
);

// update job
jobsRouter.put(
  "/update-job/:jobId",
  validationMiddleware(updateJobSchema),
  authorizationMiddleware([roles.HR, roles.USER_OWNER]),
  errorHandlerMiddleware(updateJob)
);

// delete job
jobsRouter.delete(
  "/delete-job/:jobId",
  validationMiddleware(deleteJobSchema),
  authorizationMiddleware([roles.HR, roles.USER_OWNER]),
  errorHandlerMiddleware(deleteJob)
);

// get jobs by company name
jobsRouter.get(
  "/jobs/:jobId?",
  validationMiddleware(getJobsByCompanyNameSchema),
  errorHandlerMiddleware(getJobsByCompanyName)
);

// get jobs by filters
jobsRouter.get(
  "/jobs-filters",
  validationMiddleware(getJobsByFiltersSchema),
  errorHandlerMiddleware(getJobsByFilters)
);

// get job applications
jobsRouter.get(
  "/applications/:jobId",
  validationMiddleware(getJobApplicationsSchema),
  authorizationMiddleware([roles.HR, roles.USER_OWNER]),
  errorHandlerMiddleware(getJobApplications)
);

// apply to a job
jobsRouter.post(
  "/apply/:jobId",
  multerHost(extension.DOCUMENT).single("CV"),
  validationMiddleware(applyToJobSchema),
  authorizationMiddleware([roles.USER]),
  errorHandlerMiddleware(applyToJob)
);

// update application status
jobsRouter.put(
  "/update-application-status/:applicationId",
  validationMiddleware(updateApplicationStatusSchema),
  authorizationMiddleware([roles.HR]),
  errorHandlerMiddleware(updateApplicationStatus)
);

export default jobsRouter;
