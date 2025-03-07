import { Router } from "express";
import {
  deleteCoverImage,
  deleteProfileImage,
  getAnotherUserData,
  getUserData,
  softDeleteUserAccount,
  updatePassword,
  updateUserAccount,
  uploadCoverImage,
  uploadProfileImage,
} from "./Services/userServices.js";
import { multerHost } from "../../Middlewares/multerMiddleware.js";
import { extension } from "../../Constants/constants.js";
import { authenticationMiddleware } from "../../Middlewares/authenticationMiddleware.js";
import { errorHandlerMiddleware } from "../../Middlewares/errorHandlerMiddleware.js";
import { validationMiddleware } from "../../Middlewares/validationMiddleware.js";
import {
  updatePasswordSchema,
  updateUserAccountSchema,
  uploadImageSchema,
} from "../../Validators/userSchema.js";
const userRouter = Router();

// uth router
userRouter.use(errorHandlerMiddleware(authenticationMiddleware()));

// update user account
userRouter.put(
  "/update-account-info",
  validationMiddleware(updateUserAccountSchema),
  errorHandlerMiddleware(updateUserAccount)
);

// get user profile
userRouter.get("/profile-data", errorHandlerMiddleware(getUserData));

// get another user profile
userRouter.get(
  "/another-profile-data/:id",
  errorHandlerMiddleware(getAnotherUserData)
);

// update password
userRouter.patch(
  "/update-password",
  validationMiddleware(updatePasswordSchema),
  errorHandlerMiddleware(updatePassword)
);

// upload profile image
userRouter.patch(
  "/upload-profile-image",
  validationMiddleware(uploadImageSchema),
  multerHost(extension.IMAGE).single("profile-image"),
  errorHandlerMiddleware(uploadProfileImage)
);

// upload cover image
userRouter.patch(
  "/upload-cover-image",
  validationMiddleware(uploadImageSchema),
  multerHost(extension.IMAGE).single("cover-image"),
  errorHandlerMiddleware(uploadCoverImage)
);

// delete profile image
userRouter.delete(
  "/delete-profile-image",
  errorHandlerMiddleware(deleteProfileImage)
);

// delete cover image
userRouter.delete(
  "/delete-cover-image",
  errorHandlerMiddleware(deleteCoverImage)
);

// soft delete user account
userRouter.delete(
  "/soft-delete-account",
  errorHandlerMiddleware(softDeleteUserAccount)
);

export default userRouter;
