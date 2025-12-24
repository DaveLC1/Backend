import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ======================
   CLOUDINARY CONFIG
====================== */
cloudinary.config({
  cloud_name: "daa49zag2",
  api_key: "272936612388235",
  api_secret: "gxAv0TViYSrFBFvc7brxqIkyVJY",
});

/* ======================
   MULTER (MEMORY STORAGE)
====================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ======================
   UPLOAD ROUTE
====================== */
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "blog-images",
        }
      );

      return res.json({
        url: result.secure_url,
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;
