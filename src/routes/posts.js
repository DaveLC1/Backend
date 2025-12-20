import express from "express";
import slugify from "slugify";
import auth from "../middleware/auth.js";
import { pool } from "../utils/db.js";

const router = express.Router();

router.get("/", async (_, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
  res.json(rows);
});

router.get("/:slug", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM posts WHERE slug=$1",
    [req.params.slug]
  );
  res.json(rows[0]);
});

router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  const slug = slugify(title, { lower: true });

  await pool.query(
    "INSERT INTO posts (title, slug, content) VALUES ($1,$2,$3)",
    [title, slug, content]
  );

  res.json({ success: true });
});

router.delete("/:id", auth, async (req, res) => {
  await pool.query("DELETE FROM posts WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
