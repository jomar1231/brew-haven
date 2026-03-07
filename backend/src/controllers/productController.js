/**
 * BREW HAVEN - Product Controller
 * Handles: Get all, Get one, Create, Update, Delete
 * Supports: Search, Filter by category, Pagination
 */

const prisma = require("../config/database");
const { validationResult } = require("express-validator");

// ─────────────────────────────────────────
// @route   GET /api/products
// @desc    Get all products (with search + filter)
// @access  Public
// ─────────────────────────────────────────
const getAllProducts = async (req, res, next) => {
  try {
    // Get query parameters from URL
    // Example: /api/products?search=latte&category=1&page=1
    const {
      search,
      category,
      available,
      page = 1,
      limit = 12,
    } = req.query;

    // Build dynamic filter object
    const where = {};

    // Search by product name
    if (search) {
      where.name = {
        contains: search,
      };
    }

    // Filter by category ID
    if (category) {
      where.categoryId = parseInt(category);
    }

    // Filter by availability
    if (available !== undefined) {
      where.available = available === "true";
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        // Include average rating from reviews
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0;

      return {
        ...product,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: product.reviews.length,
        reviews: undefined, // Remove raw reviews from response
      };
    });

    res.status(200).json({
      success: true,
      data: {
        products: productsWithRating,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   GET /api/products/:id
// @desc    Get single product with reviews
// @access  Public
// ─────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    res.status(200).json({
      success: true,
      data: {
        product: {
          ...product,
          avgRating: parseFloat(avgRating.toFixed(1)),
          reviewCount: product.reviews.length,
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   POST /api/products
// @desc    Create a new product
// @access  Admin only
// ─────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const {
      name,
      description,
      price,
      image,
      badge,
      stock,
      available,
      categoryId,
    } = req.body;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || null,
        badge: badge || null,
        stock: stock ? parseInt(stock) : 100,
        available: available !== undefined ? available : true,
        categoryId: parseInt(categoryId),
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Admin only
// ─────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      image,
      badge,
      stock,
      available,
      categoryId,
    } = req.body;

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name || undefined,
        description: description || undefined,
        price: price ? parseFloat(price) : undefined,
        image: image || undefined,
        badge: badge || undefined,
        stock: stock ? parseInt(stock) : undefined,
        available: available !== undefined ? available : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Admin only
// ─────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   POST /api/products/:id/reviews
// @desc    Add a review to a product
// @access  Private (logged in customers)
// ─────────────────────────────────────────
const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Check product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: req.user.id,
        productId: parseInt(id),
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId: parseInt(id),
        rating: parseInt(rating),
        comment: comment || null,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: { review },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};