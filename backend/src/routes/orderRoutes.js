/**
 * BREW HAVEN - Order Routes
 * Base path: /api/orders
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} = require("../controllers/orderController");

// ─────────────────────────────────────────
// Customer Routes (requires login)
// ─────────────────────────────────────────

// POST /api/orders (place new order)
router.post("/", auth, placeOrder);

// GET /api/orders/my (get my orders)
router.get("/my", auth, getMyOrders);

// GET /api/orders/my/:id (get my single order)
router.get("/my/:id", auth, getMyOrderById);

// ─────────────────────────────────────────
// Admin Routes
// ─────────────────────────────────────────

// GET /api/orders/stats (dashboard stats)
router.get("/stats", auth, adminOnly, getOrderStats);

// GET /api/orders (get all orders)
router.get("/", auth, adminOnly, getAllOrders);

// GET /api/orders/:id (get single order)
router.get("/:id", auth, adminOnly, getOrderById);

// PUT /api/orders/:id/status (update status)
router.put("/:id/status", auth, adminOnly, updateOrderStatus);

module.exports = router;