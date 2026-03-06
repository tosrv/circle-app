import { Router } from "express";
import { authenticate } from "../middleawares/token";
import { validate } from "../middleawares/validate";
import { threadSchema } from "../validations/thread";
import { upload } from "../middleawares/multer";
import {
  createThread,
  deleteThread,
  getThread,
  getThreads,
  updateThread,
} from "../features/thread/thread.controller";

const router = Router();

router.get("/threads", authenticate, getThreads);
router.get("/thread/:id", authenticate, getThread);
router.delete("/thread/:id", authenticate, deleteThread);

router.post(
  "/thread",
  authenticate,
  upload.array("image", 4),
  validate(threadSchema),
  createThread,
);

router.patch(
  "/thread/:id",
  authenticate,
  upload.array("image", 4),
  validate(threadSchema),
  updateThread,
);

export default router;
