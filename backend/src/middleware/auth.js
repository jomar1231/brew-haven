/**
 * BREW HAVEN - JWT Authentication Middleware
 * This runs before any protected route
 * It checks if the user has a valid token
 */

const jwt = require("jsonwebtoken");
const prisma = require("../config/database");

const auth = async (req, res, next) => {
  try {
    // Get token from request headers
    // Frontend sends it as: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login first",
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // Attach user to request object
    // Now any route after this can access req.user
    req.user = user;
    next();

  } catch (error) {
    next(error);
  }
};

module.exports = auth;