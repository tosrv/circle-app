import multer from "multer";
import path from "path";

function randomString(length: number) {
  let result = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const userId = (req as any).user.id;
    const uniqueName = Date.now() + "-" + randomString(8) + "-" + userId;
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueName + ext);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});
