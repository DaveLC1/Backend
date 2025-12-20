import express from "express";
import { pool } from "../utils/db.js";

const router = express.Router();

router.get("/:postId", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM comments WHERE post_id=$1 ORDER BY created_at",
    [req.params.postId]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { post_id, name, content } = req.body;

  await pool.query(
    "INSERT INTO comments (post_id, name, content) VALUES ($1,$2,$3)",
    [post_id, name, content]
  );

  res.json({ success: true });
});

export default router;
