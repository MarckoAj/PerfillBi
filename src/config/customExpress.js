import express from "express";
import cors from "cors";
import routes from "../routes/routes.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";

const customExpress = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));

  app.use("/api", routes);

  app.use(errorMiddleware);

  return app;
};

export default customExpress;
