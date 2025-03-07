import { Router } from "express";
import {
  signUpService,
  verifyEmailService,
  logInService,
  gmailSignUpService,
  gmailLoginService,
  forgetPassword,
  resetPassword,
  refreshToken,
  logOut,
} from "./Services/authServices.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandlerMiddleware.js";
import {
  forgetPasswordSchema,
  gmailLoginSchema,
  gmailSignUpSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  signUpSchema,
  verifyEmailSchema,
} from "../../Validators/authSchema.js";
import { validationMiddleware } from "../../Middlewares/validationMiddleware.js";
const authRouter = Router();

authRouter.post(
  "/signup",
  validationMiddleware(signUpSchema),
  errorHandlerMiddleware(signUpService)
);
authRouter.post(
  "/verify-email",
  validationMiddleware(verifyEmailSchema),
  errorHandlerMiddleware(verifyEmailService)
);
authRouter.post(
  "/login",
  validationMiddleware(loginSchema),
  errorHandlerMiddleware(logInService)
);
authRouter.post(
  "/gmail-signup",
  validationMiddleware(gmailSignUpSchema),
  errorHandlerMiddleware(gmailSignUpService)
);
authRouter.post(
  "/gmail-login",
  validationMiddleware(gmailLoginSchema),
  errorHandlerMiddleware(gmailLoginService)
);
authRouter.post(
  "/forget-password",
  validationMiddleware(forgetPasswordSchema),
  errorHandlerMiddleware(forgetPassword)
);
authRouter.post(
  "/reset-password",
  validationMiddleware(resetPasswordSchema),
  errorHandlerMiddleware(resetPassword)
);
authRouter.post(
  "/refresh-token",
  validationMiddleware(refreshTokenSchema),
  errorHandlerMiddleware(refreshToken)
);
authRouter.post(
  "/logout",
  validationMiddleware(refreshTokenSchema),
  errorHandlerMiddleware(logOut)
);

export default authRouter;
