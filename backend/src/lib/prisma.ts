import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Charger les variables d'environnement avant d'initialiser Prisma
dotenv.config();

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
