/**
 * BREW HAVEN - Cart Controller
 * Handles: Get cart, Add item, Update quantity, Remove item, Clear cart
 * All cart routes require authentication
 */

const prisma = require("../config/database");

// ─────────────────────────────────────────
// @route   GET /api/cart
// @desc    Get current user's cart with items
// @access  Private
// ─────────────────────────────────────────
const getCart = async (req, res, next) => {
  try {
    // Find cart belonging to logged in user
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                available: true,
                stock: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // If cart doesn't exist yet, create one
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: true },
      });
    }

    // Calculate cart total
    const total = cart.items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    // Calculate total number of items
    const itemCount = cart.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        cart: {
          ...cart,
          total: parseFloat(total.toFixed(2)),
          itemCount,
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   POST /api/cart
// @desc    Add a product to cart
// @access  Private
// ─────────────────────────────────────────
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.available) {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items left in stock`,
      });
    }

    // Find or create cart for this user
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
      });
    }

    // Check if product already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parseInt(productId),
      },
    });

    if (existingItem) {
      // Product already in cart — increase quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
      });
    } else {
      // Product not in cart — add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          quantity: parseInt(quantity),
        },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                available: true,
              },
            },
          },
        },
      },
    });

    // Calculate total
    const total = updatedCart.items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      message: `${product.name} added to cart`,
      data: {
        cart: {
          ...updatedCart,
          total: parseFloat(total.toFixed(2)),
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/cart/:itemId
// @desc    Update quantity of a cart item
// @access  Private
// ─────────────────────────────────────────
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || parseInt(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find the cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: { cart: true },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Make sure item belongs to current user's cart
    if (cartItem.cart.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity: parseInt(quantity) },
    });

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                available: true,
              },
            },
          },
        },
      },
    });

    const total = updatedCart.items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: {
        cart: {
          ...updatedCart,
          total: parseFloat(total.toFixed(2)),
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   DELETE /api/cart/:itemId
// @desc    Remove a single item from cart
// @access  Private
// ─────────────────────────────────────────
const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Find the cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: { cart: true },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Make sure item belongs to current user
    if (cartItem.cart.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Delete the item
    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
// ─────────────────────────────────────────
const clearCart = async (req, res, next) => {
  try {
    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Delete all items in cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};