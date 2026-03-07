/**
 * BREW HAVEN - Cart Routes
 * Base path: /api/cart
 * All routes require authentication
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

// All cart routes are protected
// auth middleware runs before every route here

// GET /api/cart
router.get("/", auth, getCart);

// POST /api/cart
router.post("/", auth, addToCart);

// PUT /api/cart/:itemId
router.put("/:itemId", auth, updateCartItem);

// DELETE /api/cart/:itemId  (remove single item)
router.delete("/:itemId", auth, removeCartItem);

// DELETE /api/cart  (clear entire cart)
router.delete("/", auth, clearCart);

module.exports = router;               