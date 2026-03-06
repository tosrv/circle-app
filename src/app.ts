import express, { json } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/index";

import { allowCors } from "./middleawares/cors";
import { errorHandler } from "./middleawares/error";

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import threadsRouter from "./routes/thread";
import likeRouter from "./routes/like";
import replyRouter from "./routes/replies";
import followsRouter from "./routes/follows";

const app = express();

app.use(allowCors);
app.use(json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "../public/images")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use(
  "/api",
  authRouter,
  userRouter,
  threadsRouter,
  likeRouter,
  replyRouter,
  followsRouter,
);

// Global error handler
app.use(errorHandler);

export default app;
