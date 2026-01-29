import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

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

app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Erreur serveur interne" });
});

app.listen(PORT, () => {});
