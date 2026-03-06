import { Router } from "express";
import { authenticate } from "../middleawares/token";
import { getLikes, replyLikes } from "../features/like/like.controller";

const router = Router();
router.post("/thread/:id/like", authenticate, getLikes);
router.post("/reply/:id/like", authenticate, replyLikes);

export default router;
