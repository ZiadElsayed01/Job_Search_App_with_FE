import { compareSync } from "bcrypt";

export const validateOTP = (user, otp, expectedType) => {
  if (!user || !user.OTP || user.OTP.length === 0) {
    return { success: false, message: "OTP not found" };
  }

  // Filter OTPs by the expected type (FORGETPASSWORD, CONFIRMEMAIL)
  let targetOTP = user.OTP.filter((otp) => otp.type === expectedType);
  targetOTP = targetOTP[targetOTP.length - 1];
  // If no OTP matches the expected type, return an error
  if (!targetOTP) {
    return { success: false, message: "Invalid OTP type" };
  }

  // Check if the OTP has expired
  if (targetOTP.expiresIn < Date.now()) {
    return { success: false, message: "OTP expired" };
  }

  // Compare the provided OTP with the stored hashed OTP
  const isOTPMatched = compareSync(otp, targetOTP.code);
  if (!isOTPMatched) {
    return { success: false, message: "Invalid OTP" };
  }

  return { success: true };
};
