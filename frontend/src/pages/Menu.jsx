/**
 * BREW HAVEN - Menu / Shop Page
 * Features: Search, Filter by category, Product grid, Pagination
 */

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/Toast";
import { formatPrice } from "../utils/helpers";
import { PageLoader } from "../components/ui/Spinner";
import { Star, ShoppingCart } from "lucide-react";

export default function Menu() {
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [pagination, setPagination]   = useState({});
  const [page, setPage]               = useState(1);
  const [addingId, setAddingId]       = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Read category from URL on load
  // e.g. /menu?category=drinks
  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setActiveCategory(cat);
  }, []);

  // ─────────────────────────────────────────
  // Fetch Categories
  // ─────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ─────────────────────────────────────────
  // Fetch Products (reruns on filter change)
  // ─────────────────────────────────────────
  useEffect(() => {
    fetchProducts();
  }, [search, activeCategory, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Build query string
      const params = new URLSearchParams();
      if (search)         params.append("search", search);
      if (activeCategory) params.append("category", getCategoryId());
      params.append("page", page);
      params.append("limit", 9);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.data.products);
      setPagination(res.data.data.pagination);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get category ID from name
  const getCategoryId = () => {
    const found = categories.find(
      (c) => c.slug === activeCategory || c.name.toLowerCase() === activeCategory
    );
    return found?.id || "";
  };

  // ─────────────────────────────────────────
  // Handle Search Submit
  // ─────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  // ─────────────────────────────────────────
  // Handle Category Filter
  // ─────────────────────────────────────────
  const handleCategory = (slug) => {
    setActiveCategory(slug);
    setPage(1);
    setSearchParams(slug ? { category: slug } : {});
  };

  // ─────────────────────────────────────────
  // Handle Clear Filters
  // ─────────────────────────────────────────
  const handleClear = () => {
    setSearch("");
    setSearchInput("");
    setActiveCategory("");
    setPage(1);
    setSearchParams({});
  };

  // ─────────────────────────────────────────
  // Handle Add to Cart
  // ─────────────────────────────────────────
  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      showToast("Please login to add items to cart", "warning");
      return;
    }
    setAddingId(product.id);
    const result = await addToCart(product.id, 1);
    if (result.success) {
      showToast(`${product.name} added to cart! ☕`, "success");
    } else {
      showToast(result.error, "error");
    }
    setAddingId(null);
  };

  return (
    <div style={{ backgroundColor: "#fdf8f0", minHeight: "100vh" }}>

      {/* ── Page Header ─────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #3d1f0a, #7b3f1e)",
        padding: "48px 0",
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}>
            Our Menu
          </h1>
          <p style={{ color: "#d4a96a" }}>
            Discover our full range of premium coffees, beans, and pastries
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Search + Filter Bar ─────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#c8874a" }}
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border
                           focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#f5deb3",
                  backgroundColor: "white",
                  focusRingColor: "#c8874a",
                }}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl font-bold text-white
                         transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#a0522d" }}
            >
              Search
            </button>
          </form>

          {/* Clear Filters */}
          {(search || activeCategory) && (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-3 rounded-xl
                         font-bold text-sm transition-colors"
              style={{
                backgroundColor: "#faefd8",
                color: "#a0522d",
              }}
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        {/* ── Category Pills ──────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {/* All Button */}
          <button
            onClick={() => handleCategory("")}
            className="px-4 py-2 rounded-full text-sm font-bold
                       transition-all duration-200"
            style={{
              backgroundColor: !activeCategory ? "#a0522d" : "#faefd8",
              color: !activeCategory ? "white" : "#a0522d",
            }}
          >
            All Products
          </button>

          {/* Category Buttons */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.slug)}
              className="px-4 py-2 rounded-full text-sm font-bold
                         transition-all duration-200"
              style={{
                backgroundColor: activeCategory === cat.slug ? "#a0522d" : "#faefd8",
                color: activeCategory === cat.slug ? "white" : "#a0522d",
              }}
            >
              {cat.name}
              <span className="ml-1 text-xs opacity-70">
                ({cat._count?.products || 0})
              </span>
            </button>
          ))}
        </div>

        {/* ── Results Count ───────────────────── */}
        {!loading && (
          <p className="text-sm mb-6" style={{ color: "#a0522d" }}>
            Showing {products.length} of {pagination.total || 0} products
            {search && ` for "${search}"`}
            {activeCategory && ` in ${activeCategory}`}
          </p>
        )}

        {/* ── Products Grid ───────────────────── */}
        {loading ? (
          <PageLoader />
        ) : products.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <p className="text-6xl mb-4">☕</p>
            <h3 className="text-xl font-bold mb-2"
                style={{ fontFamily: "Playfair Display, serif", color: "#3d1f0a" }}>
              No products found
            </h3>
            <p className="text-sm mb-4" style={{ color: "#a0522d" }}>
              Try a different search or category
            </p>
            <button
              onClick={handleClear}
              className="px-6 py-2 rounded-xl font-bold text-white"
              style={{ backgroundColor: "#a0522d" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <MenuProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingId === product.id}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ──────────────────────── */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg font-bold text-sm
                         transition-colors disabled:opacity-40"
              style={{
                backgroundColor: "#faefd8",
                color: "#a0522d",
              }}
            >
              ← Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-10 h-10 rounded-lg font-bold text-sm transition-colors"
                style={{
                  backgroundColor: page === p ? "#a0522d" : "#faefd8",
                  color: page === p ? "white" : "#a0522d",
                }}
              >
                {p}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 rounded-lg font-bold text-sm
                         transition-colors disabled:opacity-40"
              style={{
                backgroundColor: "#faefd8",
                color: "#a0522d",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Menu Product Card
// ─────────────────────────────────────────
function MenuProductCard({ product, onAddToCart, isAdding }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden
                    hover:shadow-lg transition-all duration-200 group">

      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden" style={{ height: "200px" }}>
          <img
            src={product.image ||
              "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80"}
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
          {/* Out of stock overlay */}
          {!product.available && (
            <div className="absolute inset-0 flex items-center
                            justify-center"
                 style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <span className="text-white font-bold text-sm px-3 py-1
                               bg-red-600 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs font-bold uppercase tracking-wide mb-1"
           style={{ color: "#c8874a" }}>
          {product.category?.name}
        </p>

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-800 mb-1 hover:text-amber-800
                         transition-colors"
              style={{ fontFamily: "Playfair Display, serif" }}>
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-600">
              {product.avgRating}
            </span>
            <span className="text-xs text-gray-400">
              ({product.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg"
                style={{ color: "#a0522d" }}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.available || isAdding}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                       text-xs font-bold text-white transition-opacity
                       hover:opacity-90 disabled:opacity-50
                       disabled:cursor-not-allowed"
            style={{ backgroundColor: "#a0522d" }}
          >
            <ShoppingCart size={14} />
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}