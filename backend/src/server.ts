import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./shared/db/connectDB";
import { ENV } from "./shared/env/ENV";
import routes from "./app/routes"

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

// database connection
(async () => {
  await connectDB();
})();

app.use(routes)

export default app;