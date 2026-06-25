import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ENV } from "./shared/env/ENV";
import routes from "./app/routes"
import { errorHandler } from "./shared/error/errorHandler";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);

app.use(compression());

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api",routes);

app.use(errorHandler);

export default app;