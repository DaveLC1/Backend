import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { rows } = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  const user = rows[0];
  if (!user) return res.status(401).json({ error: "Invalid" });

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

export default router;
