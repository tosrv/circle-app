import {
  getThreads,
  getThread,
  createThread,
} from "../src/features/thread/thread.controller";
import * as threadRepo from "../src/features/thread/thread.repository";
import { singleImageUrl, toImageUrl } from "../src/utils/imageUrl";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../src/utils/error";
import { redis } from "../src/lib/redis";

jest.mock("../src/features/thread/thread.repository");
jest.mock("../src/lib/redis");
jest.mock("../src/utils/error");

jest.mock("../src/middleawares/async", () => ({
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));

describe("Thread Controller - getThreads", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get all threads from db", async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);
    (threadRepo.findThreads as jest.Mock).mockResolvedValue([]);

    await getThreads(req as Request, res as Response, next);

    expect(redis.get).toHaveBeenCalled();
    expect(threadRepo.findThreads).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: [],
      source: "db",
    });

    expect(next).not.toHaveBeenCalled();
  });
});

describe("Thread Controller - getThread", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { params: { id: "1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should get a thread from db", async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);

    (threadRepo.findThread as jest.Mock).mockResolvedValue({
      id: 1,
      content: "hello",
      images: [],
      created_at: new Date(),
      created: {
        id: 1,
        username: "tosrv",
        photo_profile: null,
      },
    });

    await getThread(req as Request, res as Response, next);

    expect(redis.get).toHaveBeenCalled();
    expect(threadRepo.findThread).toHaveBeenCalledWith(1);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: expect.objectContaining({
        id: 1,
        content: "hello",
        images: [],
        created: expect.objectContaining({
          username: "tosrv",
          photo_profile: expect.any(String),
        }),
      }),
      source: "db",
    });

    expect(next).not.toHaveBeenCalled();
  });
});
