import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export interface Env {
  DB: D1Database;
}

const createPrismaClient = (env?: Env) => {
  if (env?.DB) {
    const adapter = new PrismaD1(env.DB);
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// For development/local use
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Export a helper to get prisma with D1 in Cloudflare environment
export const getPrisma = (env?: Env) => {
  return createPrismaClient(env);
};
