/**
 * BREW HAVEN - Prisma Database Client
 * This file creates a single Prisma instance
 * used across the entire application
 */

const { PrismaClient } = require("@prisma/client");

// Create Prisma instance
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Test the connection
prisma.$connect()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });

module.exports = prisma;