/**
 * BREW HAVEN - Admin Only Middleware
 * This runs after the auth middleware
 * It checks if the logged in user is an ADMIN
 * Usage: router.post("/", auth, adminOnly, controller)
 */

const adminOnly = (req, res, next) => {
  // req.user is set by the auth middleware
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only",
    });
  }

  // User is admin, allow through
  next();
};

module.exports = adminOnly;