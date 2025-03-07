import cron from "node-cron";
import {User} from "../DB/Models/userModel.js";

export const deleteExpiredOTPs = async () => {
  try {
    const now = new Date();
    const result = await User.updateMany(
      { "OTP.expiresIn": { $lt: now } },
      { $pull: { OTP: { expiresIn: { $lt: now } } } }
    );

    console.log(
      `Expired OTPs removed from ${result.modifiedCount} users at ${now}`
    );
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
};

// Schedule the job to run every 6 hours
cron.schedule("0 */6 * * *", deleteExpiredOTPs, {
  scheduled: true,
  timezone: "UTC",
});
