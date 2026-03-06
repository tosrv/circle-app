import { Router } from "express";
import {
  findUsers,
  updateUser,
  usernameCheck,
} from "../features/user/user.controller";
import { authenticate } from "../middleawares/token";
import { validate } from "../middleawares/validate";
import { updateSchema } from "../validations/user";
import { upload } from "../middleawares/multer";

const router = Router();

router.get("/user/search", authenticate, findUsers);
router.get("/user/check", authenticate, usernameCheck);

router.patch(
  "/user",
  authenticate,
  upload.single("avatar"),
  validate(updateSchema),
  updateUser,
);

export default router;
