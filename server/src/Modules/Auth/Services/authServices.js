import { compareSync, hashSync } from "bcrypt";
import { sendEmail } from "../../../Services/sendEmail.js";
import { User } from "../../../DB/Models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import { generateOTP } from "../../../utils/otpHandler.js";
import { generateToken, verifyToken } from "../../../utils/tokens.js";
import { BlackList } from "../../../DB/Models/blacklistModel.js";
import { OAuth2Client } from "google-auth-library";
import { gender, provider, type } from "../../../Constants/constants.js";
import { generateOtpEmail } from "../../../utils/emailTemplate.js";
import { validateOTP } from "../../../utils/validateOTP.js";

// SignUp
export const signUpService = async (req, res) => {
  const { firstName, lastName, email, password, gender, DOB, mobileNumber } =
    req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !gender ||
    !DOB ||
    !mobileNumber
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(404).json({ message: "Email already exists" });
  }

  // Generate OTP and hash it for security
  const OTP = generateOTP();
  const hashOTP = hashSync(OTP, +process.env.SALT);
  const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  // Send OTP via email
  sendEmail.emit("SendEmail", {
    to: email,
    subject: "Email Verification",
    html: generateOtpEmail(OTP),
  });

  // Create new user with hashed OTP
  const newUser = new User({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
    gender,
    DOB,
    mobileNumber,
    OTP: [{ code: hashOTP, type: type.CONFIRMEMAIL, expiresIn: otpExpiration }],
  });

  await newUser.save();
  res.status(201).json({ message: "User created successfully" });
};

// Verify Email
export const verifyEmailService = async (req, res) => {
  const { email, OTP } = req.body;

  // Find unverified user with OTP
  const user = await User.findOne({
    email,
    isConfirmed: false,
    OTP: { $exists: true, $ne: [] },
  });

  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found or already verified" });
  }

  // Validate OTP
  const otpValidation = validateOTP(user, OTP, type.CONFIRMEMAIL);
  if (!otpValidation.success) {
    return res.status(400).json({ message: otpValidation.message });
  }

  // Mark user as confirmed
  user.isConfirmed = true;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
};

// Log In
export const logInService = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Compare passwords
  const isPasswordMatched = compareSync(password, user.password);

  if (!isPasswordMatched) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate access and refresh tokens
  const accesstoken = generateToken({
    publicClaims: { _id: user.id },
    secretKey: process.env.JWT_SECRET,
    registeredClaims: {
      expiresIn: process.env.JWT_SECRET_EXPIRATION,
      jwtid: uuidv4(),
    },
  });

  const refreshtoken = generateToken({
    publicClaims: { _id: user.id },
    secretKey: process.env.REFRESH_JWT_SECRET,
    registeredClaims: {
      expiresIn: process.env.REFRESH_JWT_SECRET_EXPIRATION,
      jwtid: uuidv4(),
    },
  });

  res
    .status(200)
    .json({ message: "Login successful", accesstoken, refreshtoken });
};

// Google SignUp
export const gmailSignUpService = async (req, res) => {
  const { idToken } = req.body;

  // Verify Google ID token
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, email_verified, name } = payload;

  // Check if email is verified by Google
  if (!email_verified) {
    return res.status(400).json({ message: "Invalid email or not verified" });
  }

  // Check if user already exists
  const isEmailAlreadyExists = await User.findOne({ email });
  if (isEmailAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Extract first and last name from Google payload
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Generate a random password for the user
  const randomPassword = hashSync(
    Math.random().toString(36).slice(-8),
    +process.env.SALT
  );

  // Create new user with Google provider
  const user = new User({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: randomPassword,
    gender: gender.N_A,
    DOB: new Date("2000-01-01"), // Default DOB
    mobileNumber: "0000000000", // Default mobile number
    provider: provider.GOOGLE,
    isConfirmed: true, // Google-verified emails are automatically confirmed
  });

  await user.save();
  res.status(201).json({ message: "User created successfully" });
};

// Google Login
export const gmailLoginService = async (req, res) => {
  const { idToken } = req.body; // Extract Google ID token from request body

  // Initialize Google OAuth2 client
  const client = new OAuth2Client();

  // Verify the Google ID token
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID, // Use the web client ID from environment variables
  });

  // Extract payload from the verified token
  const payload = ticket.getPayload();
  const { email, email_verified } = payload;

  // Check if the email is verified by Google
  if (!email_verified) {
    return res.status(400).json({ message: "Invalid email or not verified" });
  }

  // Find the user in the database with the provided email and Google provider
  const user = await User.findOne({ email, provider: provider.GOOGLE });

  // If user is not found, return an error
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate an access token for the user
  const accesstoken = generateToken({
    publicClaims: { _id: user._id }, // Include user ID in the token payload
    secretKey: process.env.JWT_SECRET, // Use JWT secret from environment variables
    registeredClaims: {
      expiresIn: process.env.JWT_SECRET_EXPIRATION, // Set token expiration
      jwtid: uuidv4(), // Generate a unique token ID
    },
  });

  // Generate a refresh token for the user
  const refreshtoken = generateToken({
    publicClaims: { _id: user._id }, // Include user ID in the token payload
    secretKey: process.env.REFRESH_JWT_SECRET, // Use refresh token secret from environment variables
    registeredClaims: {
      expiresIn: process.env.REFRESH_JWT_SECRET_EXPIRATION, // Set refresh token expiration
      jwtid: uuidv4(), // Generate a unique token ID
    },
  });

  // Return success response with access and refresh tokens
  res
    .status(200)
    .json({ message: "Login successful", accesstoken, refreshtoken });
};

// Forget Password
export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate OTP and hash it for security
  const OTP = generateOTP();
  const hashOTP = hashSync(OTP, +process.env.SALT);
  const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  // Save OTP in user document
  user.OTP.push({
    code: hashOTP,
    type: type.FORGETPASSWORD,
    expiresIn: otpExpiration,
  });

  await user.save();

  // Send OTP via email
  sendEmail.emit("SendEmail", {
    to: email,
    subject: "Reset Password OTP",
    html: generateOtpEmail(OTP),
  });

  res.status(200).json({ message: "OTP sent successfully" });
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Validate OTP
  const otpValidation = validateOTP(user, otp, type.FORGETPASSWORD);
  if (!otpValidation.success) {
    return res.status(400).json({ message: otpValidation.message });
  }

  user.password = newPassword;
  user.changeCredentialTime = Date.now();
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const { refreshtoken } = req.headers;

  // Validate refresh token
  if (!refreshtoken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  // Verify refresh token
  const data = verifyToken({
    token: refreshtoken,
    secretKey: process.env.REFRESH_JWT_SECRET,
  });
  const user = await User.findById(data._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if token is invalidated due to credential change
  if (
    user.changeCredentialTime &&
    data.iat * 1000 < user.changeCredentialTime.getTime()
  ) {
    return res
      .status(403)
      .json({
        message: "Token expired due to credential change, please login again",
      });
  }

  // Generate new access token
  const accesstoken = generateToken({
    publicClaims: { _id: data._id },
    secretKey: process.env.JWT_SECRET,
    registeredClaims: {
      expiresIn: process.env.JWT_SECRET_EXPIRATION,
      jwtid: uuidv4(),
    },
  });

  res
    .status(200)
    .json({
      message: "Token refreshed successfully",
      accesstoken,
      refreshtoken,
    });
};

// Log Out
export const logOut = async (req, res) => {
  const { accesstoken, refreshtoken } = req.headers;

  // Validate tokens
  if (!accesstoken || !refreshtoken) {
    return res.status(400).json({ message: "Tokens are required" });
  }

  // Verify tokens and extract data
  const docodedData = verifyToken({
    token: accesstoken,
    secretKey: process.env.JWT_SECRET,
  });
  const docodedRefreshData = verifyToken({
    token: refreshtoken,
    secretKey: process.env.REFRESH_JWT_SECRET,
  });

  // Blacklist tokens to prevent further use
  await BlackList.insertMany([
    {
      tokenId: docodedData.jti,
      expiredAt: docodedRefreshData.exp,
    },
    {
      tokenId: docodedRefreshData.jti,
      expiredAt: docodedRefreshData.exp,
    },
  ]);

  res.status(200).json({ message: "Logged out successfully" });
};
