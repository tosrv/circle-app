import { Router } from "express";
import { validate } from "../middleawares/validate";
import { loginSchema, registerSchema } from "../validations/auth";
import {
  login,
  logout,
  register,
  sendUser,
} from "../features/auth/auth.controller";
import { authenticate } from "../middleawares/token";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, sendUser);
router.post("/logout", authenticate, logout);

export default router;
