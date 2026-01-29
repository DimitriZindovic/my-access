import express from "express";
import sql from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Exemple de route utilisant la connexion directe à Postgres
 * Ce fichier sert d'exemple - vous pouvez le supprimer ou l'adapter selon vos besoins
 */

/**
 * GET /api/example/users
 * Exemple : Récupérer tous les utilisateurs depuis la DB
 * Note: Cette route nécessite que vous ayez une table 'users' dans Supabase
 */
router.get("/users", authenticateToken, async (req, res) => {
  try {
    // Exemple de requête SQL directe
    const users = await sql`
      SELECT id, email, created_at 
      FROM auth.users 
      LIMIT 10
    `;

    res.json({ users });
  } catch (error) {
    console.error("Erreur DB:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

/**
 * GET /api/example/test
 * Test de connexion à la base de données
 */
router.get("/test", async (req, res) => {
  try {
    // Test simple de connexion
    const result =
      await sql`SELECT NOW() as current_time, version() as pg_version`;

    res.json({
      status: "connected",
      database: "Supabase Postgres",
      ...result[0],
    });
  } catch (error) {
    console.error("Erreur connexion DB:", error);
    res.status(500).json({
      error: "Erreur de connexion à la base de données",
      details: error.message,
    });
  }
});

export default router;
