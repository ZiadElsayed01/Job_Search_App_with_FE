import { User } from "../DB/Models/userModel.js";

export const ifUserExists = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(404).json({ message: "Email already exists" });
  }

  next();
};

export const ifUserNotExists = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  req.user = user;

  next();
};
