import { User } from "../../DB/Models/userModel.js";

export const listUsersResolvers = async () => {
  return await User.find();
};

// Ban specific user
export const banUserResolvers = async (_, args) => {
  return await User.findByIdAndUpdate(
    args._id,
    { bannedAt: new Date() },
    { new: true }
  );
};

// Unban specific user
export const unbanUserResolvers = async (_, args) => {
  return await User.findByIdAndUpdate(
    args._id,
    { bannedAt: null },
    { new: true }
  );
};
