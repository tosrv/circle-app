import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import { verifyToken } from "../utils/jwt";
import { UserPayload } from "../types/auth";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.access_token;
    if (!token) throw new AppError(401, "Unauthorized");

    const payload = verifyToken(token) as UserPayload;
    (req as any).user = payload;

    next();
  } catch (err) {
    next(err);
  }
}
