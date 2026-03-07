/**
 * BREW HAVEN - Order Controller
 * Handles: Place order, Get my orders, Get all orders (admin),
 *          Get single order, Update order status (admin)
 */

const prisma = require("../config/database");

// ─────────────────────────────────────────
// @route   POST /api/orders
// @desc    Place a new order from cart
// @access  Private
// ─────────────────────────────────────────
const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, note } = req.body;

    // Get user's cart with all items
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Check cart exists and has items
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Check all products are still available
    for (const item of cart.items) {
      if (!item.product.available) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} is no longer available`,
        });
      }

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.product.name}`,
        });
      }
    }

    // Calculate order total
    const total = cart.items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    // Create order with all items in one transaction
    // A transaction means: either ALL of this succeeds
    // or NONE of it does — keeps data safe
    const order = await prisma.$transaction(async (tx) => {
      // Step 1 — Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          total: parseFloat(total.toFixed(2)),
          status: "PENDING",
          shippingAddress: shippingAddress || null,
          note: note || null,
        },
      });

      // Step 2 — Create order items
      await tx.orderItem.createMany({
        data: cart.items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });

      // Step 3 — Reduce stock for each product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Step 4 — Clear the cart after order placed
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // Get full order details to return
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully! ☕",
      data: { order: fullOrder },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   GET /api/orders/my
// @desc    Get all orders for logged in user
// @access  Private
// ─────────────────────────────────────────
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: { orders },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   GET /api/orders/my/:id
// @desc    Get single order details for user
// @access  Private
// ─────────────────────────────────────────
const getMyOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure order belongs to current user
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: { order },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   GET /api/orders
// @desc    Get ALL orders (admin view)
// @access  Admin only
// ─────────────────────────────────────────
const getAllOrders = async (req, res, next) => {
  try {
    // Get query parameters for filtering
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter
    const where = {};
    if (status) {
      where.status = status.toUpperCase();
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const total = await prisma.order.count({ where });

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    });

    res.status(200).json({
      success: true,
      data: {
        orders,
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
// @route   GET /api/orders/:id
// @desc    Get single order by ID (admin)
// @access  Admin only
// ─────────────────────────────────────────
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { order },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Admin only
// ─────────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Valid status values
    const validStatuses = ["PENDING", "PREPARING", "COMPLETED", "CANCELLED"];

    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Check order exists
    const existing = await prisma.order.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update status
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: status.toUpperCase() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status.toUpperCase()}`,
      data: { order },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// @route   GET /api/orders/stats
// @desc    Get order statistics for admin dashboard
// @access  Admin only
// ─────────────────────────────────────────
const getOrderStats = async (req, res, next) => {
  try {
    // Count orders by status
    const [
      totalOrders,
      pendingOrders,
      preparingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PREPARING" } }),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { total: true },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalOrders,
          pendingOrders,
          preparingOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue: parseFloat(
            (totalRevenue._sum.total || 0).toFixed(2)
          ),
          totalCustomers,
          totalProducts,
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
};  