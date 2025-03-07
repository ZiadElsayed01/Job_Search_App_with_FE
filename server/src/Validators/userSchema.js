import Joi from "joi";
import { gender, roles } from "../Constants/constants.js";

export const updateUserAccountSchema = {
  body: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    DOB: Joi.date().iso(),
    gender: Joi.string()
      .valid(...Object.values(gender))
      .pattern(/^[0-9]{10,15}$/),
    role: Joi.string().valid(...Object.values(roles)),
    companyId: Joi.string().hex().length(24),
    mobileNumber: Joi.string().pattern(/^[0-9]{10,15}$/),
  }),
};

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),
};

export const uploadImageSchema = {
  file: Joi.object().required(),
};
