/**
 * BREW HAVEN - Global Error Handler
 * This middleware catches ALL errors thrown anywhere
 * in the application and returns a clean response
 */

const errorHandler = (err, req, res, next) => {
  // Log error details in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err);
  }

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Prisma specific errors
  if (err.code === "P2002") {
    // Unique constraint violation (e.g. email already exists)
    statusCode = 400;
    message = "This email is already registered";
  }

  if (err.code === "P2025") {
    // Record not found
    statusCode = 404;
    message = "Record not found";
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again";
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    // Only show error stack in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;