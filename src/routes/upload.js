import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import multerStorageCloudinary from "multer-storage-cloudinary";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ======================
   CLOUDINARY CONFIG
====================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ======================
   MULTER STORAGE
====================== */
const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

/* ======================
   UPLOAD ROUTE
====================== */
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  (req, res) => {
    try {
      return res.json({
        url: req.file.path,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

export default router;
