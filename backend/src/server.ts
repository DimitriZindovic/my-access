import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

console.log("Starting server initialization...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);

dotenv.config();

console.log("Loading routes...");
import authRoutes from "./routes/auth.js";
console.log("Routes loaded successfully");

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message || "An unexpected error occurred",
  });
});

// Start server
console.log(`Attempting to start server on port ${PORT}...`);
const server = app
  .listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Server listening on 0.0.0.0:${PORT}`);
  })
  .on("error", (err: NodeJS.ErrnoException) => {
    console.error("❌ Failed to start server:", err);
    console.error("Error code:", err.code);
    console.error("Error message:", err.message);
    process.exit(1);
  });

// Keep process alive
server.on("listening", () => {
  console.log("✅ Server is listening and ready to accept connections");
});

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

export default app;
