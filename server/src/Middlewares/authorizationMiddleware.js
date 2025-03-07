export const authorizationMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.loggedInUser;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "You are Unauthorized" });
    }

    next();
  };
};
