import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import centersRoutes from "./routes/centers.js";

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
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/centers", centersRoutes);

// Route 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Gestion des erreurs globale
app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
);

const HOST = "0.0.0.0";

app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 Serveur démarré sur ${HOST}:${PORT}`);
  console.log(`📡 API disponible sur http://${HOST}:${PORT}/api`);
});

export default app;
