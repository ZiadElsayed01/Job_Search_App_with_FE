import { globalErrorHandler } from "../Middlewares/errorHandlerMiddleware.js";
import userRouter from "../Modules/User/userController.js";
import authRouter from "../Modules/Auth/authController.js";
import companyRouter from "../Modules/Company/companyController.js";
import jobsRouter from "../Modules/Jobs/jobsController.js";
import { createHandler } from "graphql-http/lib/use/express";
import { mainSchema } from "../GraphQl/mainSchema.js";

export default function routerHandler(app) {
  app.use("/graphql", createHandler({ schema: mainSchema }));

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/jobs", jobsRouter);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome in Social app" });
  });

  app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use(globalErrorHandler);
}
