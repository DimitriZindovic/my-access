import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

// Route de santé
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Route de test de connexion DB (optionnel - pour tester la connexion)
app.get("/api/test-db", async (req, res) => {
  try {
    const sql = (await import("./config/db.js")).default;
    const result =
      await sql`SELECT NOW() as current_time, version() as pg_version`;
    res.json({
      status: "connected",
      database: "Supabase Postgres",
      ...result[0],
    });
  } catch (error) {
    console.error("Erreur connexion DB:", error);

    // Messages d'erreur plus détaillés
    let errorMessage = error.message;
    let helpfulHint = "";

    if (error.message.includes("password authentication failed")) {
      helpfulHint =
        "Vérifiez que votre DATABASE_URL contient le bon mot de passe. " +
        "Consultez SETUP_DB.md pour plus d'informations.";
    } else if (error.message.includes("timeout")) {
      helpfulHint =
        "Problème de connexion réseau. Essayez avec le Session Pooler (port 6543).";
    } else if (error.message.includes("DATABASE_URL")) {
      helpfulHint =
        "Vérifiez que DATABASE_URL est défini dans votre fichier .env";
    }

    res.status(500).json({
      error: "Erreur de connexion à la base de données",
      message: errorMessage,
      hint: helpfulHint,
    });
  }
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  res.status(500).json({ error: "Erreur serveur interne" });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
});
