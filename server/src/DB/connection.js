import mongoose from "mongoose";

const dataBaseConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed");
  }
};
export default dataBaseConnection;
