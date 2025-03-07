import Joi from "joi";
import { gender } from "../Constants/constants.js";

export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    gender: Joi.string()
      .valid(...Object.values(gender))
      .required(),
    DOB: Joi.date()
      .required()
      .custom((value, helpers) => {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();

        // Check if the user is at least 18 years old
        if (age < 18) {
          return helpers.error("any.invalid", {
            message: "User must be at least 18 years old",
          });
        }

        return value;
      }, "Age Validation")
      .messages({
        "any.invalid": "User must be at least 18 years old",
        "date.base": "DOB must be a valid date",
      }),
    mobileNumber: Joi.string().required(),
  }),
};

export const verifyEmailSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    OTP: Joi.string().required(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const gmailSignUpSchema = {
  body: Joi.object({
    idToken: Joi.string().required(),
  }),
};

export const gmailLoginSchema = {
  body: Joi.object({
    idToken: Joi.string().required(),
  }),
};

export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const resetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
};

export const refreshTokenSchema = {
  headers: Joi.object({
    refreshtoken: Joi.string().required(),
  }).unknown(true),
};

export const logOutSchema = {
  headers: Joi.object({
    accesstoken: Joi.string().required(),
    refreshtoken: Joi.string().required(),
  }).unknown(true),
};