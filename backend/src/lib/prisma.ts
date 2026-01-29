import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Test connection on startup
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error);
  // Don't exit in production, let the app start and fail gracefully on first query
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});
