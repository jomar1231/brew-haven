/**
 * BREW HAVEN - Product Routes
 * Base path: /api/products
 */

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require("../controllers/productController");

// ─────────────────────────────────────────
// Validation rules
// ─────────────────────────────────────────
const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("categoryId")
    .notEmpty()
    .withMessage("Category is required"),
];

const reviewValidation = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];

// ─────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────

// GET /api/products
router.get("/", getAllProducts);

// GET /api/products/:id
router.get("/:id", getProductById);

// ─────────────────────────────────────────
// Protected Routes (logged in users)
// ─────────────────────────────────────────

// POST /api/products/:id/reviews
router.post("/:id/reviews", auth, reviewValidation, addReview);

// ─────────────────────────────────────────
// Admin Only Routes
// ─────────────────────────────────────────

// POST /api/products
router.post("/", auth, adminOnly, productValidation, createProduct);

// PUT /api/products/:id
router.put("/:id", auth, adminOnly, updateProduct);

// DELETE /api/products/:id
router.delete("/:id", auth, adminOnly, deleteProduct);

module.exports = router;    