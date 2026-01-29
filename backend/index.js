import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import centersRoutes from "./routes/centers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000"];

console.log("🌐 CORS allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        console.log("⚠️ Request without origin (allowed)");
        return callback(null, true);
      }

      const originWithoutTrailingSlash = origin.replace(/\/$/, "");
      const isAllowed = allowedOrigins.some(
        (allowed) =>
          allowed === origin ||
          allowed === originWithoutTrailingSlash ||
          origin.startsWith(allowed)
      );

      if (isAllowed) {
        console.log(`✅ CORS allowed for origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked for origin: ${origin}`);
        console.log(`   Allowed origins: ${allowedOrigins.join(", ")}`);
        callback(
          new Error(
            `Not allowed by CORS. Origin: ${origin}. Allowed: ${allowedOrigins.join(
              ", "
            )}`
          )
        );
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/centers", centersRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.get("/api", (req, res) => {
  res.json({
    message: "API My Access",
    endpoints: {
      auth: "/api/auth",
      centers: "/api/centers",
      health: "/health",
    },
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const sql = (await import("./config/db.js")).default;
    const result =
      await sql`SELECT NOW() as current_time, version() as pg_version`;

    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) as users_table_exists
    `;

    const usersCount = await sql`SELECT COUNT(*) as count FROM users`;

    res.json({
      status: "connected",
      database: "Supabase Postgres",
      users_table_exists: tableCheck[0].users_table_exists,
      users_count: parseInt(usersCount[0].count),
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
  res.status(404).json({
    error: "Route non trouvée",
    path: req.path,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);

  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: err.message,
      allowedOrigins: allowedOrigins,
      requestOrigin: req.headers.origin,
    });
  }

  res.status(500).json({
    error: "Erreur serveur interne",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`✅ Routes chargées: /api/auth, /api/centers`);
});
