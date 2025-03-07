import { Router } from "express";
import { authenticationMiddleware } from "../../Middlewares/authenticationMiddleware.js";
import {
  createCompany,
  deleteCompanyCoverImage,
  deleteCompanyLogo,
  getSpecificCompanyData,
  searchCompaniesByName,
  softDeleteComapany,
  updateCompanyData,
  uploadCompanyCoverImage,
  uploadCompanyLogo,
} from "./Services/companyServices.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandlerMiddleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorizationMiddleware.js";
import { extension, roles } from "../../Constants/constants.js";
import { multerHost } from "../../Middlewares/multerMiddleware.js";
import { validationMiddleware } from "../../Middlewares/validationMiddleware.js";
import {
  createCompanySchema,
  deleteCompanyCoverImageSchema,
  deleteCompanyLogoSchema,
  getSpecificCompanyDataSchema,
  searchCompaniesByNameSchema,
  softDeleteCompanySchema,
  updateCompanyDataSchema,
  uploadCompanyCoverImageSchema,
  uploadCompanyLogoSchema,
} from "../../Validators/companySchema.js";
import jobsRouter from "../Jobs/jobsController.js";
const companyRouter = Router();

companyRouter.use("/:companyName", jobsRouter);

companyRouter.use(errorHandlerMiddleware(authenticationMiddleware()));

// create company
companyRouter.post(
  "/create-company",
  validationMiddleware(createCompanySchema),
  errorHandlerMiddleware(createCompany)
);

// update company data
companyRouter.post(
  "/update-company-data/:companyId",
  validationMiddleware(updateCompanyDataSchema),
  multerHost(extension.DOCUMENT).single("legalAttachment"),
  authorizationMiddleware([roles.USER_OWNER]),
  errorHandlerMiddleware(updateCompanyData)
);

// soft delete company
companyRouter.delete(
  "/soft-delete-company/:companyId",
  validationMiddleware(softDeleteCompanySchema),
  authorizationMiddleware([roles.ADMIN, roles.USER_OWNER]),
  errorHandlerMiddleware(softDeleteComapany)
);

// Get specific company data
companyRouter.get(
  "/get-specific-company-data/:companyId",
  validationMiddleware(getSpecificCompanyDataSchema),
  errorHandlerMiddleware(getSpecificCompanyData)
);

// Search companies by name
companyRouter.get(
  "/search-company-by-name",
  validationMiddleware(searchCompaniesByNameSchema),
  errorHandlerMiddleware(searchCompaniesByName)
);

// upload company logo
companyRouter.patch(
  "/upload-company-logo/:companyId",
  validationMiddleware(uploadCompanyLogoSchema),
  authorizationMiddleware([roles.ADMIN, roles.USER_OWNER]),
  multerHost(extension.IMAGE).single("company-logo"),
  errorHandlerMiddleware(uploadCompanyLogo)
);

// upload company cover image
companyRouter.patch(
  "/upload-company-cover-image/:companyId",
  validationMiddleware(uploadCompanyCoverImageSchema),
  authorizationMiddleware([roles.ADMIN, roles.USER_OWNER]),
  multerHost(extension.IMAGE).single("company-cover-image"),
  errorHandlerMiddleware(uploadCompanyCoverImage)
);

// delete company logo
companyRouter.delete(
  "/delete-company-logo/:companyId",
  validationMiddleware(deleteCompanyLogoSchema),
  authorizationMiddleware([roles.ADMIN, roles.USER_OWNER]),
  errorHandlerMiddleware(deleteCompanyLogo)
);

// delete company cover image
companyRouter.delete(
  "/delete-company-cover-image/:companyId",
  validationMiddleware(deleteCompanyCoverImageSchema),
  authorizationMiddleware([roles.ADMIN, roles.USER_OWNER]),
  errorHandlerMiddleware(deleteCompanyCoverImage)
);
export default companyRouter;
