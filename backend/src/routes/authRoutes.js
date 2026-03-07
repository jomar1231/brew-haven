/**
 * BREW HAVEN - Auth Routes
 * Base path: /api/auth
 */

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, login, getMe, updateProfile } = require("../controllers/authController");
const auth = require("../middleware/auth");

// ─────────────────────────────────────────
// Validation rules
// ─────────────────────────────────────────
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ─────────────────────────────────────────
// Routes
// ─────────────────────────────────────────

// POST /api/auth/register
router.post("/register", registerValidation, register);

// POST /api/auth/login
router.post("/login", loginValidation, login);

// GET /api/auth/me  (protected)
router.get("/me", auth, getMe);

// PUT /api/auth/profile  (protected)
router.put("/profile", auth, updateProfile);

module.exports = router;