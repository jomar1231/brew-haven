/**
 * BREW HAVEN - Main Server Entry Point
 * This file starts the Express server and connects all routes
 */

// Load environment variables from .env file FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import route files (we'll create these in later phases)
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Import global error handler
const errorHandler = require("./middleware/errorHandler");

// ─────────────────────────────────────────
// Initialize Express App
// ─────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────
// Middleware (runs on every request)
// ─────────────────────────────────────────

// Security headers
app.use(helmet());

// Allow frontend to talk to backend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://brew-haven-xi.vercel.app",
  ],
  credentials: true,
}));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));

// Log all requests in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─────────────────────────────────────────
// Routes
// ─────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ─────────────────────────────────────────
// Health Check Route
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "☕ Brew Haven API is running!",
    version: "1.0.0",
    status: "OK",
  });
});

// ─────────────────────────────────────────
// Handle unknown routes (404)
// ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─────────────────────────────────────────
// Global Error Handler (always last)
// ─────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("─────────────────────────────────");
  console.log(`☕  Brew Haven API`);
  console.log(`🚀  Server running on port ${PORT}`);
  console.log(`🌍  http://localhost:${PORT}`);
  console.log(`📦  Environment: ${process.env.NODE_ENV}`);
  console.log("─────────────────────────────────");
});

module.exports = app;