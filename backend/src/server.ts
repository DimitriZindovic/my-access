import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import centersRoutes from "./routes/centers";

// Charger les variables d'environnement
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

// Health check pour Render
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/centers", centersRoutes);

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion des erreurs globale
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
});

export default app;
