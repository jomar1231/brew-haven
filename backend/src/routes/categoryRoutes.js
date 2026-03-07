/**
 * BREW HAVEN - Category Routes
 * Base path: /api/categories
 */

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// ─────────────────────────────────────────
// Validation rules
// ─────────────────────────────────────────
const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required"),
];

// ─────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────

// GET /api/categories
router.get("/", getAllCategories);

// GET /api/categories/:id
router.get("/:id", getCategoryById);

// ─────────────────────────────────────────
// Admin Only Routes
// ─────────────────────────────────────────

// POST /api/categories
router.post("/", auth, adminOnly, categoryValidation, createCategory);

// PUT /api/categories/:id
router.put("/:id", auth, adminOnly, updateCategory);

// DELETE /api/categories/:id
router.delete("/:id", auth, adminOnly, deleteCategory);

module.exports = router;