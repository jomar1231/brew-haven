/**
 * BREW HAVEN - Category Controller
 * Handles: Get all, Get one, Create, Update, Delete
 */

const prisma = require("../config/database");
const { validationResult } = require("express-validator");

// ─────────────────────────────────────────
// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
// ─────────────────────────────────────────
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      // Include count of products in each category
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json({
      success: true,
      data: { categories },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
// ─────────────────────────────────────────
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          where: { available: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { category },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   POST /api/categories
// @desc    Create a new category
// @access  Admin only
// ─────────────────────────────────────────
const createCategory = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, description } = req.body;

    // Create slug from name (e.g. "Hot Drinks" → "hot-drinks")
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const category = await prisma.category.create({
      data: { name, slug, description },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Admin only
// ─────────────────────────────────────────
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update slug if name changed
    const slug = name
      ? name.toLowerCase().replace(/\s+/g, "-")
      : existing.slug;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        slug,
        description: description || undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: { category },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Admin only
// ─────────────────────────────────────────
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { products: true } } },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Prevent delete if category has products
    if (existing._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete. This category has ${existing._count.products} products`,
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};