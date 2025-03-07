import jwt from "jsonwebtoken";

export const generateToken = ({
  publicClaims,
  secretKey,
  registeredClaims = {},
}) => {
  return jwt.sign(publicClaims, secretKey, registeredClaims);
};

export const verifyToken = ({ token, secretKey }) => {
  return jwt.verify(token, secretKey);
};
