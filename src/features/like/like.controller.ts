import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../middleawares/async";
import { prisma } from "../../lib/prisma";
import { broadcastEvent } from "../../sockets/websocket";
import { requireThread } from "../thread/thread.controller";

export const getLikes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = Number((req as any).user.id);
    const threadId = Number(req.params.id);

    await requireThread(threadId);

    const existingLike = await prisma.likes.findUnique({
      where: {
        user_id_thread_id: {
          user_id: user,
          thread_id: threadId,
        },
      },
    });

    let isLiked: boolean;
    if (existingLike) {
      await prisma.likes.delete({
        where: {
          user_id_thread_id: {
            user_id: user,
            thread_id: threadId,
          },
        },
      });
      isLiked = false;
    } else {
      await prisma.likes.create({
        data: {
          user_id: user,
          thread_id: threadId,
          created_by: user,
        },
      });
      isLiked = true;
    }

    const likeCount = await prisma.likes.count({
      where: {
        thread_id: threadId,
      },
    });

    broadcastEvent("like", {
      id: threadId,
      count: likeCount,
    });

    res.status(200).json({
      status: "success",
      message: isLiked ? "Thread liked" : "Thread unliked",
      isLiked,
      likeCount,
    });
  },
);

export const replyLikes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number((req as any).user.id);
    const replyId = Number(req.params.id);

    const reply = await prisma.replies.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      return res
        .status(404)
        .json({ status: "error", message: "Reply not found" });
    }

    const existingLike = await prisma.replyLikes.findUnique({
      where: {
        user_id_reply_id: {
          user_id: userId,
          reply_id: replyId,
        },
      },
    });

    let isLiked: boolean;

    if (existingLike) {
      await prisma.replyLikes.delete({
        where: {
          user_id_reply_id: {
            user_id: userId,
            reply_id: replyId,
          },
        },
      });
      isLiked = false;
    } else {
      await prisma.replyLikes.create({
        data: {
          user_id: userId,
          reply_id: replyId,
        },
      });
      isLiked = true;
    }

    const likeCount = await prisma.replyLikes.count({
      where: { reply_id: replyId },
    });

    broadcastEvent("reply_like", {
      replyId,
      likeCount
    });

    res.status(200).json({
      status: "success",
      message: isLiked ? "Reply liked" : "Reply unliked",
      isLiked,
      likeCount,
    });
  },
);
