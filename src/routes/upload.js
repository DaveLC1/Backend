import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ======================
   HARD-CODED CLOUDINARY (TEST ONLY)
====================== */
cloudinary.config({
  cloud_name: "daa49zag2",
  api_key: "272936612388235",
  api_secret: "gxAv0TViYSrFBFvc7brxqIkyVJY",
});

/* ======================
   MULTER STORAGE
====================== */
const storage = new CloudinaryStorage({
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
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    return res.json({
      url: req.file.path, // Cloudinary URL
    });
  }
);

export default router;  }

  res.json({
    url: req.file.path, // Cloudinary URL
  });
});

export default router;
