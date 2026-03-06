import { Router } from "express";
import { authenticate } from "../middleawares/token";
import {
  follow,
  getFollows,
  usersToFollow,
} from "../features/follows/follows.controller";

const router = Router();

router.get("/follow", authenticate, usersToFollow);
router.get("/follows", authenticate, getFollows);
router.post("/follow/:id", authenticate, follow);

export default router;
