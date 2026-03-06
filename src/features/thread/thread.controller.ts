import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../middleawares/async";
import { AppError } from "../../utils/error";
import { singleImageUrl, toImageUrl } from "../../utils/imageUrl";
import {
  addThread,
  editThread,
  findThread,
  findThreads,
  removeThread,
} from "./thread.repository";
import { broadcastEvent } from "../../sockets/websocket";
import { timeAgo } from "../../utils/time";
import { findUserById } from "../auth/auth.repository";
import { redis } from "../../lib/redis";

const THREADS_CACHE_KEY = "threads:all";
const THREADS_TTL = 30;

export async function requireUser(id: number) {
  const user = await findUserById(id);
  if (!user) throw new AppError(404, "User not found");

  return user;
}

export async function requireThread(threadId: number) {
  const thread = await findThread(threadId);
  if (!thread) throw new AppError(404, "Thread not found");

  return thread;
}

async function author(id: number, threadId: number) {
  const user = await requireUser(id);
  const thread = await requireThread(threadId);

  if (thread.created_by !== user.id) throw new AppError(401, "Unauthorized");
  return;
}

// Display all threads
export const getThreads = asyncHandler(async (req: Request, res: Response) => {
  const cached = await redis.get(THREADS_CACHE_KEY);
  if (cached) {
    return res.status(200).json({
      status: "success",
      data: cached,
      source: "cache",
    });
  }

  const threads = await findThreads();
  if (!threads) throw new AppError(404, "Threads not found");

  const data = threads.map((thread) => ({
    ...thread,
    images: toImageUrl(thread.images),
    created_at: timeAgo(thread.created_at),
    created: {
      ...thread.created,
      photo_profile: singleImageUrl(thread.created.photo_profile || ""),
    },
  }));

  await redis.set(THREADS_CACHE_KEY, JSON.stringify(data), { ex: THREADS_TTL });

  res.status(200).json({
    status: "success",
    data,
    source: "db",
  });
});

// Display by id
export const getThread = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const threadId = Number(req.params.id);
    const thread = await requireThread(threadId);
    const cacheKey = `thread:id:${threadId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        status: "success",
        data: cached,
        source: "cache",
      });
    }

    const data = {
      ...thread,
      images: toImageUrl(thread.images),
      created: {
        ...thread.created,
        photo_profile: singleImageUrl(thread.created.photo_profile || ""),
      },
    };

    await redis.set(cacheKey, JSON.stringify(data), { ex: THREADS_TTL });

    res.status(200).json({
      status: "success",
      data,
      source: "db",
    });
  },
);

// Create new thread
export const createThread = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const content = req.body.content;
    const images = req.files as Express.Multer.File[];
    const image: string[] = images?.map((img) => img.filename) || [];

    const newThread = await addThread(userId, content, image);
    const data = {
      ...newThread,
      images: toImageUrl(newThread.images),
      created_at: timeAgo(newThread.created_at),
      created: {
        ...newThread.created,
        photo_profile: singleImageUrl(newThread.created.photo_profile || ""),
      },
    };

    try {
      await redis.del(THREADS_CACHE_KEY);
      await redis.del(`threads:id:${newThread.id}`);
    } catch (err) {
      console.warn("Redis error, cache not invalidated");
    }

    broadcastEvent("new_thread", data, userId);

    res.status(201).json({
      status: "success",
      message: "Thread created",
      data,
    });
  },
);

// Delete thread
export const deleteThread = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const threadId = Number(req.params.id);

    await author(userId, threadId);
    await removeThread(threadId);

    try {
      await redis.del(THREADS_CACHE_KEY);
      await redis.del(`threads:id:${threadId}`);
    } catch (err) {
      console.warn("Redis error, cache not invalidated");
    }

    res.status(200).json({
      status: "success",
      message: "Thread deleted",
    });
  },
);

// Update thread
export const updateThread = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const threadId = Number(req.params.id);
    const content = req.body.content;
    const images = req.files as Express.Multer.File[];
    const image: string[] = images?.map((img) => img.filename) || [];

    await author(userId, threadId);
    const updated = await editThread(threadId, content, image);

    const data = {
      ...updated,
      images: toImageUrl(updated.images),
      created: {
        ...updated.created,
        photo_profile: singleImageUrl(updated.created.photo_profile || ""),
      },
    };

    try {
      await redis.del(THREADS_CACHE_KEY);
      await redis.del(`threads:id:${threadId}`);
    } catch (err) {
      console.warn("Redis error, cache not invalidated");
    }

    res.status(200).json({
      status: "success",
      message: "Thread updated",
      data,
    });
  },
);
