import { compareSync } from "bcrypt";
import { User } from "../../../DB/Models/userModel.js";
import { cloudinaryConfig } from "../../../Config/cloudinaryConfig.js";
import { upload } from "../../../utils/uploadFiles.js";
import { Company } from "../../../DB/Models/companyModel.js";
import { roles } from "../../../Constants/constants.js";

// Update User Account
export const updateUserAccount = async (req, res) => {
  const { _id } = req.loggedInUser;

  // We should send role and company id if user is HR
  const { firstName, lastName, DOB, gender, mobileNumber, role, companyId } =
    req.body;

  if (roles.HR && !companyId) {
    return res.status(400).json({
      message: "Please provide company id if you are HR",
    });
  }

  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName,
      lastName,
      DOB,
      gender,
      mobileNumber,
      role,
    },
    {
      new: true,
    }
  );

  // If the user's role is HR and a companyId is provided, add them to the HRs array in the Company model
  if (role === roles.HR && companyId) {
    const company = await Company.findById(companyId);
    if (company) {
      // Check if the user is already in the HRs array
      if (!company.HRs.includes(user._id)) {
        company.HRs.push(user._id);
        await company.save();
      }
    }
  }

  res.status(200).json({ message: "User updated successfully", user });
};

// Get User Data
export const getUserData = async (req, res) => {
  const { _id } = req.loggedInUser;
  const user = await User.findById(_id);
  res.status(200).json({ message: "User profile fetched successfully", user });
};

// Get Another User Data
export const getAnotherUserData = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id, deleted: false }).select(
    "username mobileNumber profilePic coverPic"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User profile fetched successfully", user });
};

// Update Password
export const updatePassword = async (req, res) => {
  const { _id } = req.loggedInUser;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(_id);
  if (!compareSync(oldPassword, user.password)) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }

  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json({ message: "This password is already used before" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully", user });
};

// Upload Profile Image
export const uploadProfileImage = async (req, res) => {
  const { file } = req;
  const { _id } = req.loggedInUser;

  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const user = await User.findById(_id);
  if (user.profilePic?.public_id) {
    await cloudinaryConfig().uploader.destroy(user.profilePic.public_id);
  }

  const { secure_url, public_id } = await upload(file, "Users/Profile");

  await User.findByIdAndUpdate(
    _id,
    { profilePic: { secure_url, public_id } },
    { new: true }
  );

  res.status(200).json({ message: "Profile Image uploaded successfully" });
};

// Upload Cover Image
export const uploadCoverImage = async (req, res) => {
  const { file } = req;
  const { _id } = req.loggedInUser;
  if (!file) {
    return res.status(400).json({ message: "No image uploaded" });
  }
  const user = await User.findById(_id);

  if (user.coverPic?.public_id) {
    await cloudinaryConfig().uploader.destroy(user.coverPic.public_id);
  }

  const { secure_url, public_id } = await upload(file, "Users/Cover");

  await User.findByIdAndUpdate(
    _id,
    { coverPic: { secure_url, public_id } },
    { new: true }
  );

  res.status(200).json({ message: "Cover Image uploaded successfully" });
};

// Delete Profile Image
export const deleteProfileImage = async (req, res) => {
  const { _id } = req.loggedInUser;

  const user = await User.findById(_id);

  if (user.profilePic?.public_id) {
    await cloudinaryConfig().uploader.destroy(user.profilePic.public_id);
  } else {
    return res.status(400).json({ message: "Profile image not found" });
  }

  user.profilePic = undefined;
  await user.save();

  res.status(200).json({ message: "Profile image deleted successfully", user });
};

// Delete Cover Image
export const deleteCoverImage = async (req, res) => {
  const { _id } = req.loggedInUser;

  const user = await User.findById(_id);

  if (user.coverPic?.public_id) {
    await cloudinaryConfig().uploader.destroy(user.coverPic.public_id);
  } else {
    return res.status(400).json({ message: "Cover image not found" });
  }

  user.coverPic = undefined;
  await user.save();

  res.status(200).json({ message: "Cover image deleted successfully", user });
};

// Soft Delete User Account
export const softDeleteUserAccount = async (req, res) => {
  const { _id } = req.loggedInUser;

  const user = await User.findById(_id);

  user.deleted = true;
  user.deletedAt = Date.now();
  await user.save();

  res.status(200).json({ message: "User account deleted successfully", user });
};
