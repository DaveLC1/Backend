import express from "express";
import { pool } from "../utils/db.js";

const router = express.Router();

/**
 * Get comments for a post
 */
router.get("/:postId", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM comments WHERE post_id=$1 ORDER BY created_at",
      [req.params.postId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

/**
 * Create comment
 */
router.post("/", async (req, res) => {
  const { postId, name, content } = req.body;

  if (!postId || !name || !content) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO comments (post_id, name, content) VALUES ($1,$2,$3)",
      [postId, name, content]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

/**
 * DELETE comment (ADMIN)
 */
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM comments WHERE id=$1",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
