/**
 * BREW HAVEN - Helper Utilities
 * Reusable functions used across the app
 */

// ─────────────────────────────────────────
// Format price to currency string
// Usage: formatPrice(4.5) → "$4.50"
// ─────────────────────────────────────────
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// ─────────────────────────────────────────
// Format date to readable string
// Usage: formatDate("2024-01-15") → "January 15, 2024"
// ─────────────────────────────────────────
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

// ─────────────────────────────────────────
// Get order status color for badges
// ─────────────────────────────────────────
export const getStatusColor = (status) => {
  const colors = {
    PENDING:   "bg-yellow-100 text-yellow-700",
    PREPARING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

// ─────────────────────────────────────────
// Get order status label
// ─────────────────────────────────────────
export const getStatusLabel = (status) => {
  const labels = {
    PENDING:   "⏳ Pending",
    PREPARING: "☕ Preparing",
    COMPLETED: "✅ Completed",
    CANCELLED: "❌ Cancelled",
  };
  return labels[status] || status;
};

// ─────────────────────────────────────────
// Truncate long text
// Usage: truncate("Long text here", 20) → "Long text here..."
// ─────────────────────────────────────────
export const truncate = (text, length = 100) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// ─────────────────────────────────────────
// Capitalize first letter
// ─────────────────────────────────────────
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};