import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./src/utils/db.js";
import authRoutes from "./src/routes/auth.js";
import postsRoutes from "./src/routes/posts.js";
import commentsRoutes from "./src/routes/comments.js";
import uploadRoutes from "./src/routes/upload.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Group4 API running" });
});

const PORT = process.env.PORT || 8090;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup error:", err.message);
    process.exit(1);
  }
})();
