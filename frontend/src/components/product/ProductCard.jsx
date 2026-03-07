/**
 * BREW HAVEN - Product Card Component
 * Displays a single product in the grid
 */

import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../ui/Toast";
import { formatPrice } from "../../utils/helpers";
import Badge from "../ui/Badge";

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const showToast = useToast();

  const inCart = isInCart(product.id);

  // ── Handle Add to Cart ───────────────────
  const handleAddToCart = async (e) => {
    // Prevent navigating to product page
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast("Please login to add items to cart", "warning");
      return;
    }

    const result = await addToCart(product.id, 1);

    if (result.success) {
      showToast(`${product.name} added to cart! ☕`, "success");
    } else {
      showToast(result.error || "Failed to add to cart", "error");
    }
  };

  // ── Badge color map ──────────────────────
  const getBadgeColor = (badge) => {
    if (!badge) return "brown";
    const b = badge.toLowerCase();
    if (b.includes("new"))    return "green";
    if (b.includes("limit"))  return "red";
    if (b.includes("cold"))   return "blue";
    if (b.includes("season")) return "yellow";
    return "brown";
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div
        className="bg-white rounded-2xl overflow-hidden
                   shadow-sm hover:shadow-md transition-all
                   duration-200 group cursor-pointer h-full
                   flex flex-col"
      >
        {/* ── Product Image ──────────────────── */}
        <div className="relative overflow-hidden"
             style={{ height: "200px" }}>
          <img
            src={product.image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80"}
            alt={product.name}
            className="w-full h-full object-cover
                       group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge overlay */}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge color={getBadgeColor(product.badge)}>
                {product.badge}
              </Badge>
            </div>
          )}

          {/* Out of stock overlay */}
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center"
                 style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <span className="text-white font-bold text-sm bg-red-600
                               px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* ── Product Info ───────────────────── */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category */}
          <p className="text-xs font-bold uppercase tracking-wide mb-1"
             style={{ color: "#c8874a" }}>
            {product.category?.name}
          </p>

          {/* Name */}
          <h3 className="font-bold mb-1 line-clamp-1"
              style={{
                fontFamily: "Playfair Display, serif",
                color: "#3d1f0a",
                fontSize: "1rem",
              }}>
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs mb-3 flex-1 line-clamp-2"
             style={{ color: "#7b3f1e" }}>
            {product.description}
          </p>

          {/* Rating */}
          {product.avgRating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star size={12} fill="#c8874a" color="#c8874a" />
              <span className="text-xs font-bold"
                    style={{ color: "#7b3f1e" }}>
                {product.avgRating}
              </span>
              <span className="text-xs"
                    style={{ color: "#c8874a" }}>
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-lg"
                  style={{
                    fontFamily: "Playfair Display, serif",
                    color: "#a0522d",
                  }}>
              {formatPrice(product.price)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={!product.available}
              className="flex items-center gap-1.5 px-3 py-2
                         rounded-lg text-xs font-bold text-white
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: inCart ? "#7b3f1e" : "#a0522d",
              }}
            >
              <ShoppingCart size={14} />
              {inCart ? "In Cart" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}   