import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Charger les variables d'environnement avant d'initialiser Prisma
dotenv.config();

// Vérifier que DATABASE_URL est définie
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not defined!");
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("SUPABASE")));
  throw new Error("DATABASE_URL environment variable is required");
}

declare global {
  var prisma: PrismaClient | undefined;
}

// Prisma Client lit automatiquement DATABASE_URL depuis process.env
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
