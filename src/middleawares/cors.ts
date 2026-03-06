import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";

dotenv.config();
const corsOptions: CorsOptions = {
  origin: process.env.CORS,
  credentials: true,
  optionsSuccessStatus: 200,
};

export const allowCors = cors(corsOptions);
