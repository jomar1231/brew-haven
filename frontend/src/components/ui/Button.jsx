/**
 * BREW HAVEN - Reusable Button Component
 * Usage: <Button variant="primary" size="md" loading={false}>Click me</Button>
 */

import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
}) {
  // ── Variant Styles ───────────────────────
  const variants = {
    primary: {
      backgroundColor: "#a0522d",
      color: "white",
      border: "2px solid #a0522d",
    },
    secondary: {
      backgroundColor: "transparent",
      color: "#a0522d",
      border: "2px solid #a0522d",
    },
    danger: {
      backgroundColor: "#dc2626",
      color: "white",
      border: "2px solid #dc2626",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "#7b3f1e",
      border: "2px solid transparent",
    },
  };

  // ── Size Styles ──────────────────────────
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={variants[variant]}
      className={`
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        font-bold rounded-lg
        flex items-center justify-center gap-2
        transition-opacity duration-200
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}
        ${className}
      `}
    >
      {/* Loading spinner */}
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}