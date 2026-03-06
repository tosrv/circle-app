import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserPayload } from "../types/auth";

dotenv.config();
const Key = process.env.JWT_SECRET as string;

export function signToken(payload: UserPayload) {
  return jwt.sign(payload, Key, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, Key) as UserPayload;
}
