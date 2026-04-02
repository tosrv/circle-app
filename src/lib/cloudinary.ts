import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

function randomString(length: number) {
  let result = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

cloudinary.config({
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
});

export const uploadToCloudinary = (fileBuffer: Buffer, userId: number) => {
  return new Promise((resolve, reject) => {
    const uniqueName = Date.now() + "-" + randomString(8) + "-" + userId;
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads", public_id: uniqueName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
