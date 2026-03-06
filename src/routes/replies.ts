import { Router } from "express";
import { authenticate } from "../middleawares/token";
import { validate } from "../middleawares/validate";
import { threadSchema } from "../validations/thread";
import {
  createReply,
  getReplies,
} from "../features/replies/replies.controller";
import { upload } from "../middleawares/multer";

const router = Router();

router.post(
  "/reply/:id",
  authenticate,
  upload.array("image", 4),
  validate(threadSchema),
  createReply,
);

router.get("/replies/:id", authenticate, getReplies);

export default router;
