/**
 * BREW HAVEN - Home Page
 * Sections: Hero, Features, Featured Products, CTA
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Coffee, Package, Clock, Award } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/Toast";
import { formatPrice } from "../utils/helpers";
import { PageLoader } from "../components/ui/Spinner";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // ─────────────────────────────────────────
  // Fetch featured products on load
  // ─────────────────────────────────────────
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get("/products?limit=4");
        setFeaturedProducts(response.data.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // ─────────────────────────────────────────
  // Handle Add to Cart
  // ─────────────────────────────────────────
  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      showToast("Please login to add items to cart", "warning");
      return;
    }
    const result = await addToCart(product.id, 1);
    if (result.success) {
      showToast(`${product.name} added to cart! ☕`, "success");
    } else {
      showToast(result.error, "error");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div style={{ backgroundColor: "#fdf8f0" }}>

      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #3d1f0a 0%, #7b3f1e 50%, #a0522d 100%)",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative circles */}
        <div style={{
          position: "absolute", top: "-100px", right: "-100px",
          width: "500px", height: "500px",
          borderRadius: "50%",
          backgroundColor: "rgba(200, 135, 74, 0.1)",
        }} />
        <div style={{
          position: "absolute", bottom: "-150px", left: "-100px",
          width: "400px", height: "400px",
          borderRadius: "50%",
          backgroundColor: "rgba(200, 135, 74, 0.08)",
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — Text Content */}
            <div className="animate-fadeIn">
              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-2
                              rounded-full mb-6"
                   style={{ backgroundColor: "rgba(200,135,74,0.2)" }}>
                <Coffee size={14} style={{ color: "#d4a96a" }} />
                <span className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: "#d4a96a" }}>
                  Premium Coffee Experience
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6
                             leading-tight"
                  style={{ fontFamily: "Playfair Display, serif" }}>
                Where Every
                <span style={{ color: "#d4a96a" }}> Sip </span>
                Tells a Story
              </h1>

              {/* Subheadline */}
              <p className="text-lg mb-8 leading-relaxed max-w-lg"
                 style={{ color: "#e8c88a" }}>
                Discover our handcrafted coffee drinks, premium single-origin
                beans, and freshly baked pastries — delivered straight to your door.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 px-8 py-4
                             rounded-xl font-bold text-base transition-all
                             duration-200 hover:gap-3"
                  style={{ backgroundColor: "#d4a96a", color: "#3d1f0a" }}
                >
                  Explore Menu
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4
                             rounded-xl font-bold text-base transition-all
                             duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: "transparent",
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.4)",
                  }}
                >
                  Join Us Free
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { number: "50+", label: "Coffee Blends" },
                  { number: "10K+", label: "Happy Customers" },
                  { number: "4.9★", label: "Average Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white"
                       style={{ fontFamily: "Playfair Display, serif" }}>
                      {stat.number}
                    </p>
                    <p className="text-xs" style={{ color: "#d4a96a" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero Image Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=80",
                "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80",
                "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80",
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80",
              ].map((src, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden
                    ${i === 1 ? "mt-8" : ""}
                    ${i === 3 ? "-mt-8" : ""}
                  `}
                  style={{ height: "200px" }}
                >
                  <img
                    src={src}
                    alt="Coffee"
                    className="w-full h-full object-cover
                               hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES SECTION
      ════════════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Coffee,
                title: "Premium Quality",
                desc: "Single-origin beans sourced directly from top farms worldwide",
                color: "#a0522d",
                bg: "#faefd8",
              },
              {
                icon: Clock,
                title: "Fresh Daily",
                desc: "Pastries baked every morning, drinks crafted to order",
                color: "#2563eb",
                bg: "#eff6ff",
              },
              {
                icon: Package,
                title: "Fast Delivery",
                desc: "Same-day delivery available within Metro Manila",
                color: "#16a34a",
                bg: "#f0fdf4",
              },
              {
                icon: Award,
                title: "Award Winning",
                desc: "Recognized as the best online coffee shop 3 years running",
                color: "#d97706",
                bg: "#fffbeb",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl text-center
                           hover:shadow-md transition-shadow duration-200"
                style={{ backgroundColor: feature.bg }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center
                              justify-center mx-auto mb-4"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2"
                    style={{ fontFamily: "Playfair Display, serif" }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED PRODUCTS SECTION
      ════════════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#fdf8f0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-widest uppercase mb-2"
               style={{ color: "#a0522d" }}>
              Our Offerings
            </p>
            <h2 className="text-4xl font-bold mb-3"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#3d1f0a",
                }}>
              Featured Products
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Handpicked favorites from our menu —
              crafted with love and the finest ingredients
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3
                         rounded-xl font-bold text-sm transition-all
                         duration-200 hover:gap-3"
              style={{
                backgroundColor: "#a0522d",
                color: "white",
              }}
            >
              View Full Menu
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CATEGORIES SECTION
      ════════════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "#3d1f0a",
                }}>
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Drinks",
                desc: "Hot & cold coffee beverages",
                image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80",
                query: "drinks",
              },
              {
                name: "Beans",
                desc: "Single-origin & blends",
                image: "https://images.unsplash.com/photo-1587734195342-6d6c43f5c7c2?w=500&q=80",
                query: "beans",
              },
              {
                name: "Pastries",
                desc: "Freshly baked daily",
                image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80",
                query: "pastries",
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/menu?category=${cat.query}`}
                className="group relative rounded-2xl overflow-hidden
                           hover:shadow-xl transition-shadow duration-300"
                style={{ height: "220px" }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover
                             group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col
                              justify-end p-6"
                  style={{
                    background: "linear-gradient(to top, rgba(61,31,10,0.9) 0%, transparent 60%)",
                  }}
                >
                  <h3 className="text-xl font-bold text-white"
                      style={{ fontFamily: "Playfair Display, serif" }}>
                    {cat.name}
                  </h3>
                  <p className="text-sm" style={{ color: "#d4a96a" }}>
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════ */}
      <section
        className="py-20 text-center"
        style={{
          background: "linear-gradient(135deg, #3d1f0a, #7b3f1e)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <Coffee size={48} className="mx-auto mb-6"
                  style={{ color: "#d4a96a" }} />
          <h2 className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}>
            Ready to Brew Your Day?
          </h2>
          <p className="mb-8 text-lg" style={{ color: "#e8c88a" }}>
            Join thousands of coffee lovers who start their morning with Brew Haven.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4
                         rounded-xl font-bold text-base transition-all
                         duration-200 hover:opacity-90"
              style={{ backgroundColor: "#d4a96a", color: "#3d1f0a" }}
            >
              Order Now
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4
                         rounded-xl font-bold text-base transition-all
                         duration-200 hover:opacity-80"
              style={{
                border: "2px solid rgba(255,255,255,0.4)",
                color: "white",
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────
// Product Card Component (used only here)
// ─────────────────────────────────────────
function ProductCard({ product, onAddToCart }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden
                 hover:shadow-lg transition-all duration-200
                 group"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "180px" }}>
        <img
          src={product.image || "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80"}
          alt={product.name}
          className="w-full h-full object-cover
                     group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 px-2 py-1 rounded-full
                       text-xs font-bold uppercase"
            style={{ backgroundColor: "#a0522d", color: "white" }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs font-bold uppercase tracking-wide mb-1"
           style={{ color: "#c8874a" }}>
          {product.category?.name}
        </p>

        {/* Name */}
        <h3 className="font-bold mb-1 text-gray-800"
            style={{ fontFamily: "Playfair Display, serif" }}>
          {product.name}
        </h3>

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-600">
              {product.avgRating}
            </span>
            <span className="text-xs text-gray-400">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-lg"
                style={{ color: "#a0522d" }}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold
                       text-white transition-colors duration-200
                       hover:opacity-90"
            style={{ backgroundColor: "#a0522d" }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}