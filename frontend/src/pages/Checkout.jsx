/**
 * BREW HAVEN - Checkout Page
 * Handles order placement with shipping details
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, CheckCircle,
  MapPin, MessageSquare, Coffee,
} from "lucide-react";
import api from "../api/axios";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/Toast";
import { formatPrice } from "../utils/helpers";

export default function Checkout() {
  const [form, setForm] = useState({
    shippingAddress: "",
    note: "",
  });
  const [loading, setLoading]       = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  const { cart, fetchCart }   = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast }         = useToast();
  const navigate              = useNavigate();

  // Redirect if not logged in
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex flex-col items-center
                   justify-center text-center px-4"
        style={{ backgroundColor: "#fdf8f0" }}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{
            fontFamily: "Playfair Display, serif",
            color: "#3d1f0a",
          }}
        >
          Please Login First
        </h2>
        <Link
          to="/login"
          className="px-6 py-3 rounded-xl font-bold text-white"
          style={{ backgroundColor: "#a0522d" }}
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cart.items.length === 0 && !orderPlaced) {
    return (
      <div
        className="min-h-screen flex flex-col items-center
                   justify-center text-center px-4"
        style={{ backgroundColor: "#fdf8f0" }}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{
            fontFamily: "Playfair Display, serif",
            color: "#3d1f0a",
          }}
        >
          Your Cart is Empty
        </h2>
        <Link
          to="/menu"
          className="px-6 py-3 rounded-xl font-bold text-white"
          style={{ backgroundColor: "#a0522d" }}
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Handle Place Order
  // ─────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!form.shippingAddress.trim()) {
      showToast("Please enter your shipping address", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/orders", {
        shippingAddress: form.shippingAddress,
        note: form.note,
      });

      setOrderPlaced(response.data.data.order);
      await fetchCart(); // Refresh cart (will be empty now)
      showToast("Order placed successfully! ☕", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to place order",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Order Success Screen
  // ─────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div
        className="min-h-screen flex flex-col items-center
                   justify-center text-center px-4"
        style={{ backgroundColor: "#fdf8f0" }}
      >
        <div
          className="bg-white rounded-3xl p-10 shadow-sm max-w-md w-full"
        >
          {/* Success Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center
                       justify-center mx-auto mb-6"
            style={{ backgroundColor: "#f0fdf4" }}
          >
            <CheckCircle size={40} className="text-green-500" />
          </div>

          <h2
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: "Playfair Display, serif",
              color: "#3d1f0a",
            }}
          >
            Order Placed!
          </h2>
          <p className="text-gray-500 mb-2">
            Thank you for your order, {user?.name?.split(" ")[0]}! ☕
          </p>
          <p
            className="text-sm font-bold mb-6"
            style={{ color: "#a0522d" }}
          >
            Order #{orderPlaced.id}
          </p>

          {/* Order Details */}
          <div
            className="rounded-xl p-4 mb-6 text-left"
            style={{ backgroundColor: "#fdf8f0" }}
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Status</span>
              <span
                className="text-sm font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "#fef9c3",
                  color: "#854d0e",
                }}
              >
                ⏳ Pending
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Total</span>
              <span
                className="font-bold"
                style={{ color: "#a0522d" }}
              >
                {formatPrice(orderPlaced.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Items</span>
              <span className="text-sm font-bold text-gray-700">
                {orderPlaced.items?.length} item(s)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="w-full py-3 rounded-xl font-bold text-white
                         text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#a0522d" }}
            >
              View My Orders
            </Link>
            <Link
              to="/menu"
              className="w-full py-3 rounded-xl font-bold text-center
                         transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "#faefd8",
                color: "#a0522d",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Checkout Form
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
            Checkout
          </h1>
          <p style={{ color: "#d4a96a" }} className="mt-1">
            Almost there! Fill in your details to complete the order.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-sm font-bold mb-6
                     transition-opacity hover:opacity-70"
          style={{ color: "#a0522d" }}
        >
          <ArrowLeft size={16} />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Left — Checkout Form ─────────────── */}
          <div className="space-y-6">

            {/* Customer Info (read only) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2
                className="text-lg font-bold mb-4"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#3d1f0a",
                }}
              >
                Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Name
                  </p>
                  <p className="font-bold text-gray-800">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="font-bold text-gray-800">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2
                className="text-lg font-bold mb-4"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#3d1f0a",
                }}
              >
                <MapPin
                  size={18}
                  className="inline mr-2"
                  style={{ color: "#a0522d" }}
                />
                Delivery Address
              </h2>
              <textarea
                value={form.shippingAddress}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shippingAddress: e.target.value }))
                }
                placeholder="Enter your full delivery address..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           text-sm resize-none"
                style={{ borderColor: "#f5deb3" }}
              />
            </div>

            {/* Order Note */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2
                className="text-lg font-bold mb-4"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#3d1f0a",
                }}
              >
                <MessageSquare
                  size={18}
                  className="inline mr-2"
                  style={{ color: "#a0522d" }}
                />
                Order Note
                <span className="text-sm font-normal text-gray-400 ml-2">
                  (optional)
                </span>
              </h2>
              <textarea
                value={form.note}
                onChange={(e) =>
                  setForm((f) => ({ ...f, note: e.target.value }))
                }
                placeholder="Any special instructions? e.g. Extra hot, no sugar..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2
                           text-sm resize-none"
                style={{ borderColor: "#f5deb3" }}
              />
            </div>
          </div>

          {/* ── Right — Order Summary ────────────── */}
          <div>
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

              {/* Items List */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >
                    {/* Mini Image */}
                    <div
                      className="rounded-lg overflow-hidden shrink-0"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <img
                        src={item.product.image ||
                          "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=100&q=80"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name + Qty */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <span
                      className="text-sm font-bold shrink-0"
                      style={{ color: "#a0522d" }}
                    >
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                className="mb-4"
                style={{ borderTop: "1px solid #faefd8" }}
              />

              {/* Totals */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold" style={{ color: "#3d1f0a" }}>
                    {formatPrice(cart.total)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span
                    className="font-bold"
                    style={{ color: "#16a34a" }}
                  >
                    Free
                  </span>
                </div>
                <div
                  className="pt-3 mt-2"
                  style={{ borderTop: "1px solid #faefd8" }}
                >
                  <div className="flex justify-between">
                    <span
                      className="font-bold text-lg"
                      style={{ color: "#3d1f0a" }}
                    >
                      Total
                    </span>
                    <span
                      className="font-bold text-2xl"
                      style={{
                        color: "#a0522d",
                        fontFamily: "Playfair Display, serif",
                      }}
                    >
                      {formatPrice(cart.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2
                           py-4 rounded-xl font-bold text-white text-base
                           transition-opacity hover:opacity-90
                           disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#a0522d" }}
              >
                <Coffee size={20} />
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                By placing your order you agree to our terms of service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}