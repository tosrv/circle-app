import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/error";
import {
  adduser,
  findEmail,
  findUserById,
  findUserByUsername,
} from "./auth.repository";
import { signToken } from "../../utils/jwt";
import { asyncHandler } from "../../middleawares/async";
import { countFollowers, countFollowing } from "../follows/follows.repository";

// Registration
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, fullname, email, password } = req.body;

    if (await findUserByUsername(username))
      throw new AppError(409, "Username already used");
    if (await findEmail(email))
      throw new AppError(409, "Email already registered");

    const hashPass = await bcrypt.hash(password, 10);
    const user = await adduser({
      username,
      fullname,
      email,
      password: hashPass,
    });

    res.status(201).json({
      status: "success",
      message: "Registration successful, please login",
      data: user,
    });
  },
);

// Login
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await findEmail(email);
    if (!user) throw new AppError(400, "Invalid email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError(400, "Invalid email or password");

    const { id, username } = user;
    const token = signToken({ id, username });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "User login successfully",
      data: token,
    });
  },
);

// Send user data
export const sendUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const user = await findUserById(userId);

    const followersCount = await countFollowers(userId);
    const followingCount = await countFollowing(userId);

    const data = {
      ...user,
      photo_profile: user?.photo_profile || "",
      followers_count: followersCount,
      following_count: followingCount,
    };

    res.status(200).json({ user: data });
  },
);

// Logout
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      status: "success",
      message: "User logout successfully",
    });
  },
);
