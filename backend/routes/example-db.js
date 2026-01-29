import express from "express";
import sql from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await sql`
      SELECT id, email, created_at 
      FROM auth.users 
      LIMIT 10
    `;

    res.json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

router.get("/test", async (req, res) => {
  try {
    const result =
      await sql`SELECT NOW() as current_time, version() as pg_version`;

    res.json({
      status: "connected",
      database: "Supabase Postgres",
      ...result[0],
    });
  } catch (error) {
    res.status(500).json({
      error: "Erreur de connexion à la base de données",
      details: error.message,
    });
  }
});

export default router;
