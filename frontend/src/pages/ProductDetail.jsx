/**
 * BREW HAVEN - Product Detail Page
 * Shows full product info, reviews, and add to cart
 */

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star, ShoppingCart, ArrowLeft,
  Package, ChevronUp, ChevronDown,
} from "lucide-react";
import api from "../api/axios";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/Toast";
import { formatPrice, formatDate } from "../utils/helpers";
import { PageLoader } from "../components/ui/Spinner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding]     = useState(false);
  const [review, setReview]     = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // ─────────────────────────────────────────
  // Fetch Product
  // ─────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data.product);
      } catch (error) {
        showToast("Product not found", "error");
        navigate("/menu");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ─────────────────────────────────────────
  // Handle Add to Cart
  // ─────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast("Please login to add items to cart", "warning");
      navigate("/login");
      return;
    }
    setAdding(true);
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      showToast(`${product.name} added to cart! ☕`, "success");
    } else {
      showToast(result.error, "error");
    }
    setAdding(false);
  };

  // ─────────────────────────────────────────
  // Handle Submit Review
  // ─────────────────────────────────────────
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Please login to leave a review", "warning");
      return;
    }
    try {
      setSubmitting(true);
      await api.post(`/products/${id}/reviews`, review);
      showToast("Review submitted! Thank you ☕", "success");
      // Refresh product to show new review
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.data.product);
      setReview({ rating: 5, comment: "" });
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to submit review",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!product) return null;

  return (
    <div style={{ backgroundColor: "#fdf8f0", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Back Button ─────────────────────── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm font-bold
                     transition-colors hover:opacity-70"
          style={{ color: "#a0522d" }}
        >
          <ArrowLeft size={16} />
          Back to Menu
        </button>

        {/* ── Product Main Section ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

          {/* Left — Image */}
          <div className="rounded-2xl overflow-hidden bg-white shadow-sm"
               style={{ height: "450px" }}>
            <img
              src={product.image ||
                "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right — Product Info */}
          <div className="flex flex-col justify-center">

            {/* Category + Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: "#c8874a" }}>
                {product.category?.name}
              </span>
              {product.badge && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                  style={{ backgroundColor: "#faefd8", color: "#a0522d" }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-4xl font-bold text-gray-800 mb-3"
                style={{ fontFamily: "Playfair Display, serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            {product.avgRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.round(product.avgRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {product.avgRating}
                </span>
                <span className="text-sm text-gray-400">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <Package size={16} style={{ color: "#a0522d" }} />
              <span className="text-sm font-bold"
                    style={{ color: product.stock > 10 ? "#16a34a" : "#dc2626" }}>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold"
                    style={{ color: "#a0522d",
                             fontFamily: "Playfair Display, serif" }}>
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            {product.available ? (
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border rounded-xl overflow-hidden"
                     style={{ borderColor: "#f5deb3" }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-3 hover:opacity-70 transition-opacity"
                    style={{ backgroundColor: "#faefd8" }}
                  >
                    <ChevronDown size={16} style={{ color: "#a0522d" }} />
                  </button>
                  <span className="px-6 py-3 font-bold text-center min-w-12"
                        style={{ color: "#3d1f0a" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-3 hover:opacity-70 transition-opacity"
                    style={{ backgroundColor: "#faefd8" }}
                  >
                    <ChevronUp size={16} style={{ color: "#a0522d" }} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 flex items-center justify-center gap-2
                             py-3 px-6 rounded-xl font-bold text-white
                             transition-opacity hover:opacity-90
                             disabled:opacity-50"
                  style={{ backgroundColor: "#a0522d" }}
                >
                  <ShoppingCart size={18} />
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            ) : (
              <div className="px-6 py-3 rounded-xl text-center font-bold"
                   style={{ backgroundColor: "#faefd8", color: "#a0522d" }}>
                Currently Unavailable
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews Section ──────────────────── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6"
              style={{ fontFamily: "Playfair Display, serif", color: "#3d1f0a" }}>
            Customer Reviews
            <span className="text-base font-normal text-gray-400 ml-2">
              ({product.reviews?.length || 0})
            </span>
          </h2>

          {/* Write Review Form */}
          {isAuthenticated && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-8 p-4 rounded-xl"
              style={{ backgroundColor: "#fdf8f0" }}
            >
              <h3 className="font-bold mb-3" style={{ color: "#3d1f0a" }}>
                Write a Review
              </h3>

              {/* Star Rating Selector */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReview((r) => ({ ...r, rating: star }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={star <= review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"}
                    />
                  </button>
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  {review.rating}/5
                </span>
              </div>

              {/* Comment */}
              <textarea
                value={review.comment}
                onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
                placeholder="Share your experience with this product..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2 text-sm resize-none"
                style={{ borderColor: "#f5deb3" }}
              />

              <button
                type="submit"
                disabled={submitting}
                className="mt-3 px-6 py-2 rounded-xl font-bold text-white
                           text-sm transition-opacity hover:opacity-90
                           disabled:opacity-50"
                style={{ backgroundColor: "#a0522d" }}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {product.reviews?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews?.map((review) => (
                <div
                  key={review.id}
                  className="pb-4"
                  style={{ borderBottom: "1px solid #faefd8" }}
                >
                  {/* Reviewer */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center
                                  justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: "#a0522d" }}
                    >
                      {review.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {review.user?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    {/* Stars */}
                    <div className="flex ml-auto">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={star <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Comment */}
                  {review.comment && (
                    <p className="text-sm text-gray-600 ml-11">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}