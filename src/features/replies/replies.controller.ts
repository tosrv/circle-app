import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../middleawares/async";
import { requireThread, requireUser } from "../thread/thread.controller";
import { addReply, findReplies } from "./replies.repository";
import { broadcastReply } from "../../sockets/websocket";
import { singleImageUrl, toImageUrl } from "../../utils/imageUrl";
import { prisma } from "../../lib/prisma";

// New reply
export const createReply = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const threadId = Number(req.params.id);
    const content = req.body.content;
    const images = req.files as Express.Multer.File[];
    const image: string[] = images?.map((img) => img.filename) || [];

    const user = await requireUser(userId);
    await requireThread(threadId);

    const reply = await addReply(threadId, user.id, content, image);
    const data = {
      ...reply,
      images: toImageUrl(reply.images),
      created: {
        ...reply.created,
        photo_profile: singleImageUrl(reply.created.photo_profile || ""),
      },
    };

    broadcastReply(data);

    res.status(201).json({
      status: "success",
      message: "Reply created successfully",
      data,
    });
  },
);

// Display replies
export const getReplies = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const threadId = Number(req.params.id);
    const userId = Number((req as any).user.id);

    const replies = await findReplies(threadId);
    const replyIds = replies.map((r) => r.id);

    const likeCountsRaw = await prisma.replyLikes.groupBy({
      by: ["reply_id"],
      where: { reply_id: { in: replyIds } },
      _count: { reply_id: true },
    });

    const likeCountsMap = Object.fromEntries(
      likeCountsRaw.map((lc) => [lc.reply_id, lc._count.reply_id]),
    );

    const userLikes = await prisma.replyLikes.findMany({
      where: { user_id: userId, reply_id: { in: replyIds } },
    });
    const userLikedSet = new Set(userLikes.map((ul) => ul.reply_id));

    const data = replies.map((reply) => ({
      ...reply,
      images: toImageUrl(reply.images),
      created: {
        ...reply.created,
        photo_profile: singleImageUrl(reply.created.photo_profile || ""),
      },
      likeCount: likeCountsMap[reply.id] || 0,
      isLiked: userLikedSet.has(reply.id),
    }));

    res.status(200).json({
      status: "success",
      message: "Replies found",
      data,
    });
  },
);
