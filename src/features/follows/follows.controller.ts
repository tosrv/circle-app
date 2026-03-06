import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../middleawares/async";
import {
  countFollowers,
  countFollowing,
  existFollow,
  findFollowers,
  findFollowing,
  findFollows,
  findUsersToFollow,
  followUser,
  unfollowUser,
} from "./follows.repository";
import { AppError } from "../../utils/error";
import { singleImageUrl } from "../../utils/imageUrl";
import { broadcastFollow } from "../../sockets/websocket";

// User to follow
export const usersToFollow = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const followIds = await findFollows(userId);
    const users = await findUsersToFollow(followIds, userId);

    const data = users.map((user) => ({
      ...user,
      photo_profile: singleImageUrl(user?.photo_profile || ""),
    }));

    res.status(200).json({
      status: "success",
      data,
    });
  },
);

// Display followers or followings
export const getFollows = asyncHandler(async (req: Request, res: Response) => {
  const { type, username } = req.query as {
    type?: "followers" | "followings";
    username?: string;
  };

  if (!type || !username) {
    throw new AppError(400, "Type and username query required");
  }

  const userId = (req as any).user.id;

  const follow =
    type === "followers"
      ? await findFollowers(username, userId)
      : await findFollowing(username, userId);

  const data = follow.map((user) => ({
    ...user,
    photo_profile: singleImageUrl(user.photo_profile || ""),
  }));

  res.status(200).json({
    status: "success",
    message: `${type} found`,
    data,
  });
});

// Follow & Unfollow user
export const follow = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const username = (req as any).user.username;
    const followId = Number(req.params.id);

    if (userId === followId) {
      throw new AppError(400, "You cannot follow yourself");
    }

    const existingFollow = await existFollow(userId, followId);

    let follows: boolean;
    if (existingFollow) {
      await unfollowUser(userId, followId);
      follows = false;
    } else {
      await followUser(userId, followId);
      follows = true;
    }

    const followersCount = await countFollowers(followId);
    const followingCount = await countFollowing(userId);

    broadcastFollow(
      followId,
      userId,
      { followersCount },
      { followingCount },
      follows,
    );

    res.status(200).json({
      status: "success",
      message: follows ? "Followed" : "Unfollowed",
      data: {
        follows,
        followers_count: followersCount,
        following_count: followingCount,
      },
    });
  },
);
