import {
  register,
  login,
  sendUser,
  logout,
} from "../src/features/auth/auth.controller";
import * as authRepo from "../src/features/auth/auth.repository";
import * as followRepo from "../src/features/follows/follows.repository";
import { singleImageUrl } from "../src/utils/imageUrl";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../src/utils/error";

jest.mock("../src/features/auth/auth.repository");
jest.mock("../src/features/follows/follows.repository");
jest.mock("../src/utils/imageUrl", () => ({
  singleImageUrl: jest.fn(),
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("../src/middleawares/async", () => ({
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));

describe("Auth Controller - register", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // =============================
  // ✅ SUCCESS REGISTER
  // =============================
  it("should register user successfully", async () => {
    req.body = {
      username: "tosrv",
      fullname: "Tosrv User",
      email: "tosrv@example.com",
      password: "123456",
    };

    (authRepo.findUserByUsername as jest.Mock).mockResolvedValue(null);
    (authRepo.findEmail as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");
    (authRepo.adduser as jest.Mock).mockResolvedValue({
      id: 1,
      username: "tosrv",
      fullname: "Tosrv User",
      email: "tosrv@example.com",
    });

    await register(req as Request, res as Response, next);

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(authRepo.adduser).toHaveBeenCalledWith({
      username: "tosrv",
      fullname: "Tosrv User",
      email: "tosrv@example.com",
      password: "hashedpass",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Registration successful, please login",
      data: {
        id: 1,
        username: "tosrv",
        fullname: "Tosrv User",
        email: "tosrv@example.com",
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  // =============================
  // ❌ USERNAME EXISTS
  // =============================
  it("should throw error when username already used", async () => {
    req.body = {
      username: "tosrv",
      fullname: "Tosrv User",
      email: "tosrv@example.com",
      password: "123456",
    };

    (authRepo.findUserByUsername as jest.Mock).mockResolvedValue({ id: 1 });

    await register(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = (next as jest.Mock).mock.calls[0][0];

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(409);
    expect(error.message).toBe("Username already used");
  });

  // =============================
  // ❌ EMAIL EXISTS
  // =============================
  it("should throw error when email already registered", async () => {
    req.body = {
      username: "testuser",
      fullname: "Tosrv User",
      email: "tosrv@example.com",
      password: "123456",
    };

    (authRepo.findUserByUsername as jest.Mock).mockResolvedValue(null);
    (authRepo.findEmail as jest.Mock).mockResolvedValue({ id: 1 });

    await register(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = (next as jest.Mock).mock.calls[0][0];

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(409);
    expect(error.message).toBe("Email already registered");
  });
});

describe("Auth Controller - login", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // =============================
  // ✅ SUCCESS LOGIN
  // =============================
  it("should login user successfully", async () => {
    req.body = {
      email: "tosrv@example.com",
      password: "123456",
    };

    (authRepo.findEmail as jest.Mock).mockResolvedValue({
      id: 1,
      username: "tosrv",
      fullname: "Tosrv User",
      email: "tosrv@example.com",
      password: "hashedpass",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token");

    await login(req as Request, res as Response, next);

    expect(authRepo.findEmail).toHaveBeenCalledWith("tosrv@example.com");
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashedpass");
    expect(jwt.sign).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "User login successfully",
      data: "token",
    });

    expect(next).not.toHaveBeenCalled();
  });

  // =============================
  // ❌ INVALID EMAIL
  // =============================
  it("should throw error when invalid email or password", async () => {
    req.body = {
      email: "tosrv@example.com",
      password: "123456",
    };

    (authRepo.findEmail as jest.Mock).mockResolvedValue(null);

    await login(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = (next as jest.Mock).mock.calls[0][0];

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(400);
    expect(error.message).toBe("Invalid email or password");
  });

  // =============================
  // ❌ INVALID PASSWORD
  // =============================
  it("should throw error when invalid email or password", async () => {
    req.body = {
      email: "tosrv@example.com",
      password: "123456",
    };

    (authRepo.findEmail as jest.Mock).mockResolvedValue({
      id: 1,
      username: "tosrv",
      fullname: "Tosrv User",
      email: "tosrv@example.com",
      password: "hashedpass",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await login(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = (next as jest.Mock).mock.calls[0][0];

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(400);
    expect(error.message).toBe("Invalid email or password");
  });
});

describe("Auth Controller - user data", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: { id: 1 },
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // =============================
  // ✅ SUCCESS GET USER DATA
  // =============================
  it("should send user data successfully", async () => {
    (authRepo.findUserById as jest.Mock).mockResolvedValue({
      id: 1,
      username: "tosrv",
      fullname: "Tosrv User",
      email: "tosrv@example.com",
      photo_profile: "avatar.png",
    });

    (followRepo.countFollowers as jest.Mock).mockResolvedValue(10);
    (followRepo.countFollowing as jest.Mock).mockResolvedValue(5);

    (singleImageUrl as jest.Mock).mockReturnValue(
      "https://cdn.example.com/avatar.png",
    );

    await sendUser(req as Request, res as Response, next);

    expect(authRepo.findUserById).toHaveBeenCalledWith(1);
    expect(followRepo.countFollowers).toHaveBeenCalledWith(1);
    expect(followRepo.countFollowing).toHaveBeenCalledWith(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 1,
        username: "tosrv",
        fullname: "Tosrv User",
        email: "tosrv@example.com",
        photo_profile: "https://cdn.example.com/avatar.png",
        followers_count: 10,
        following_count: 5,
      },
    });

    expect(next).not.toHaveBeenCalled();
  });
});

describe("Auth Controller - logout", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // =============================
  // ✅ SUCCESS LOGOUT
  // =============================
  it("should logout successfully", async () => {
    await logout(req as Request, res as Response, next);

    expect(res.clearCookie).toHaveBeenCalledWith("access_token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "User logout successfully",
    });

    expect(next).not.toHaveBeenCalled();
  });
});
