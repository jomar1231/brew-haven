/**
 * BREW HAVEN - Cart Page
 * Shows all cart items with quantity controls and order summary
 */

import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Trash2, Plus, Minus,
  ArrowRight, ArrowLeft, Coffee,
} from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/Toast";
import { formatPrice } from "../utils/helpers";
import { PageLoader } from "../components/ui/Spinner";

export default function Cart() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // ─────────────────────────────────────────
  // Handle Quantity Update
  // ─────────────────────────────────────────
  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    const result = await updateQuantity(itemId, newQty);
    if (!result.success) {
      showToast(result.error || "Failed to update quantity", "error");
    }
  };

  // ─────────────────────────────────────────
  // Handle Remove Item
  // ─────────────────────────────────────────
  const handleRemove = async (itemId, productName) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      showToast(`${productName} removed from cart`, "info");
    } else {
      showToast("Failed to remove item", "error");
    }
  };

  // ─────────────────────────────────────────
  // Not logged in
  // ─────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex flex-col items-center
                   justify-center text-center px-4"
        style={{ backgroundColor: "#fdf8f0" }}
      >
        <Coffee size={64} style={{ color: "#d4a96a" }} className="mb-4" />
        <h2
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: "Playfair Display, serif",
            color: "#3d1f0a",
          }}
        >
          Your Cart is Waiting
        </h2>
        <p className="text-gray-500 mb-6">
          Please login to view your cart and place orders
        </p>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl font-bold text-white
                       transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#a0522d" }}
          >
            Login
          </Link>
          <Link
            to="/menu"
            className="px-6 py-3 rounded-xl font-bold
                       transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "#faefd8",
              color: "#a0522d",
            }}
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <PageLoader />;

  // ─────────────────────────────────────────
  // Empty Cart
  // ─────────────────────────────────────────
  if (cart.items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center
                   justify-center text-center px-4"
        style={{ backgroundColor: "#fdf8f0" }}
      >
        <ShoppingCart
          size={64}
          style={{ color: "#d4a96a" }}
          className="mb-4"
        />
        <h2
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: "Playfair Display, serif",
            color: "#3d1f0a",
          }}
        >
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet
        </p>
        <Link
          to="/menu"
          className="flex items-center gap-2 px-6 py-3 rounded-xl
                     font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#a0522d" }}
        >
          <Coffee size={18} />
          Browse Menu
        </Link>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Cart with Items
  // ─────────────────────────────────────────
  return (
    <div style={{ backgroundColor: "#fdf8f0", minHeight: "100vh" }}>

      {/* ── Page Header ─────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #3d1f0a, #7b3f1e)",
        padding: "40px 0",
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Your Cart
          </h1>
          <p style={{ color: "#d4a96a" }} className="mt-1">
            {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Cart Items ──────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Back to Menu */}
            <button
              onClick={() => navigate("/menu")}
              className="flex items-center gap-2 text-sm font-bold
                         mb-2 transition-opacity hover:opacity-70"
              style={{ color: "#a0522d" }}
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </button>

            {/* Cart Item Cards */}
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm
                           flex gap-4 items-center"
              >
                {/* Product Image */}
                <Link to={`/product/${item.product.id}`}>
                  <div
                    className="rounded-xl overflow-hidden shrink-0"
                    style={{ width: "90px", height: "90px" }}
                  >
                    <img
                      src={item.product.image ||
                        "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&q=80"}
                      alt={item.product.name}
                      className="w-full h-full object-cover
                                 hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3
                      className="font-bold text-gray-800 hover:text-amber-800
                                 transition-colors truncate"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {item.product.name}
                    </h3>
                  </Link>
                  <p
                    className="text-sm font-bold mt-1"
                    style={{ color: "#a0522d" }}
                  >
                    {formatPrice(item.product.price)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-lg flex items-center
                               justify-center transition-opacity
                               hover:opacity-70 disabled:opacity-30"
                    style={{ backgroundColor: "#faefd8" }}
                  >
                    <Minus size={14} style={{ color: "#a0522d" }} />
                  </button>

                  <span
                    className="w-8 text-center font-bold text-sm"
                    style={{ color: "#3d1f0a" }}
                  >
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center
                               justify-center transition-opacity hover:opacity-70"
                    style={{ backgroundColor: "#faefd8" }}
                  >
                    <Plus size={14} style={{ color: "#a0522d" }} />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right shrink-0 min-w-16">
                  <p
                    className="font-bold"
                    style={{ color: "#3d1f0a" }}
                  >
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id, item.product.name)}
                  className="p-2 rounded-lg transition-colors
                             hover:bg-red-50 shrink-0"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {/* ── Order Summary ───────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2
                className="text-xl font-bold mb-6"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#3d1f0a",
                }}
              >
                Order Summary
              </h2>

              {/* Items Summary */}
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600 truncate mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-bold shrink-0"
                          style={{ color: "#3d1f0a" }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                className="my-4"
                style={{ borderTop: "1px solid #faefd8" }}
              />

              {/* Subtotal */}
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="font-bold" style={{ color: "#3d1f0a" }}>
                  {formatPrice(cart.total)}
                </span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Delivery</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "#16a34a" }}
                >
                  Free
                </span>
              </div>

              {/* Divider */}
              <div
                className="my-4"
                style={{ borderTop: "1px solid #faefd8" }}
              />

              {/* Total */}
              <div className="flex justify-between mb-6">
                <span
                  className="font-bold text-lg"
                  style={{ color: "#3d1f0a" }}
                >
                  Total
                </span>
                <span
                  className="font-bold text-xl"
                  style={{
                    color: "#a0522d",
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {formatPrice(cart.total)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2
                           py-4 rounded-xl font-bold text-white text-base
                           transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#a0522d" }}
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              {/* Continue Shopping */}
              <Link
                to="/menu"
                className="block text-center mt-3 text-sm font-bold
                           transition-opacity hover:opacity-70"
                style={{ color: "#a0522d" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}