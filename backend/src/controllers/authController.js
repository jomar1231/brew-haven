/**
 * BREW HAVEN - Auth Controller
 * Handles: Register, Login, Get current user
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const prisma = require("../config/database");

// ─────────────────────────────────────────
// Helper: Generate JWT Token
// ─────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// ─────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new customer
// @access  Public
// ─────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, email, password, phone, address } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Hash the password (never store plain text)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Create an empty cart for the new user
    await prisma.cart.create({
      data: { userId: user.id },
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user, token },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
// ─────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private (requires token)
// ─────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the auth middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: { user },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private (requires token)
// ─────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        address: address || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };