import { BlackList } from "../DB/Models/blacklistModel.js";
import { User } from "../DB/Models/userModel.js";
import { verifyToken } from "../utils/tokens.js";

export const authenticationMiddleware = (api) => {
  return async (req, res, next) => {
    const { accesstoken } = req.headers;

    if (!accesstoken) {
      return res.status(400).json({ message: "Please login" });
    }

    const data = verifyToken({ token: accesstoken, secretKey: process.env.JWT_SECRET });

    const ifTokenBlacklisted = await BlackList.findOne({ tokenId: data.jti });
    if (ifTokenBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }

    const user = await User.findOne({ _id: data._id });
    if (!user) {
      return res.status(401).json({ message: "User not found, please login again" });
    }

    req.loggedInUser = user;

    next();
  };
};
