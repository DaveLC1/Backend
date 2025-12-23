import express from "express";
import slugify from "slugify";
import auth from "../middleware/auth.js";
import { pool } from "../utils/db.js";

const router = express.Router();

/* ================= GET ALL POSTS ================= */
router.get("/", async (_, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
  res.json(rows);
});

/* ================= GET POST BY ID ================= */
router.get("/id/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM posts WHERE id = $1",
    [req.params.id]
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(rows[0]);
});

/* ================= GET POST BY SLUG ================= */
router.get("/slug/:slug", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM posts WHERE slug = $1",
    [req.params.slug]
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(rows[0]);
});

/* ================= CREATE POST ================= */
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  const slug = slugify(title, { lower: true, strict: true });

  await pool.query(
    "INSERT INTO posts (title, slug, content) VALUES ($1,$2,$3)",
    [title, slug, content]
  );

  res.json({ success: true });
});

/* ================= DELETE POST ================= */
router.delete("/:id", auth, async (req, res) => {
  await pool.query("DELETE FROM posts WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

export default router;
