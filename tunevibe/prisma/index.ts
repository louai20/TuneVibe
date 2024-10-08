//@ts-nocheck
import { PrismaClient } from "@prisma/client";

// Initialize the PrismaClient
const prisma = new PrismaClient();
export let db: prisma;

declare global {
  namespace NodeJS {
    interface Global {
      db: PrismaClient | undefined; // Make it optional
    }
  }
}

if (process.env.NODE_ENV === "production") {
  // In production, instantiate a new Prisma Client
  db = prisma;
} else {
  // In development, use a singleton pattern
  if (!global.prisma) {
    global.prisma = prisma;
  }
  db = global.prisma; // Use the global instance
}

// Ensure db is declared here
