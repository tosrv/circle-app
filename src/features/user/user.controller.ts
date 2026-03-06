import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../middleawares/async";
import {
  editUser,
  findUserByUsernameOrName,
  findUsername,
} from "./user.repository";
import { singleImageUrl } from "../../utils/imageUrl";
import { countFollowers, countFollowing } from "../follows/follows.repository";
import { AppError } from "../../utils/error";

// Display by username
export const findUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const search = req.query.q as string;

    if (!search) throw new AppError(400, "Search query is required");
    const users = await findUserByUsernameOrName(search, userId);

    const data = await Promise.all(
      users.map(async (user) => {
        const followersCount = await countFollowers(user.id);
        const followingCount = await countFollowing(user.id);
        return {
          ...user,
          photo_profile: singleImageUrl(user.photo_profile || ""),
          followers_count: followersCount,
          following_count: followingCount,
          is_following: user.followers.length > 0,
        };
      }),
    );

    res.status(200).json({
      status: "success",
      data,
    });
  },
);

// Check username for update
export const usernameCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.query;
    const userId = (req as any).user.id;

    if (typeof username !== "string") {
      return res.status(400).json({
        status: "error",
        message: "username query is required",
      });
    }

    const user = await findUsername(username, userId);

    res.status(200).json({
      status: "success",
      available: !user,
    });
  },
);

// Update user data
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, fullname, bio } = req.body;
    const image = req.file?.filename;
    const user = await editUser(
      (req as any).user.id,
      username,
      fullname,
      bio,
      image,
    );

    const data = {
      ...user,
      photo_profile: singleImageUrl(user.photo_profile || ""),
    };

    res.status(200).json({
      status: "success",
      data,
    });
  },
);
