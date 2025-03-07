import express from "express";
import { config } from "dotenv";
import routerHandler from "./utils/routerHandler.js";
import dataBaseConnection from "./DB/connection.js";
config();
import cors from "cors";
import "./CronJobs/deleteExpiredOTPs.js";
import { Server } from "socket.io";
import http from "http";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Server
const server = http.createServer();
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// CORS options
const whitelist = [process.env.CORS_ORIGIN, undefined];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  legacyHeaders: false,
});

const bootstrap = () => {
  const app = express();
  app.use(express.json());
  app.use(limiter);
  app.use(cors(corsOptions));
  app.use(helmet());

  routerHandler(app, express);
  dataBaseConnection();

  const onlineHRs = new Map();
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for HR joining a company room
    socket.on("joinCompany", (companyId) => {
      socket.join(companyId);
      console.log(`HR joined company room: ${companyId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server is running in port ${process.env.PORT}`);
  });
};

export default bootstrap;
