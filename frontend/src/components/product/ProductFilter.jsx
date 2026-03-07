/**
 * BREW HAVEN - Product Filter Component
 * Search bar + category filter tabs
 */

import { Search, X } from "lucide-react";

export default function ProductFilter({
  search,
  setSearch,
  activeCategory,
  setActiveCategory,
  categories = [],
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">

      {/* ── Search Bar ──────────────────────── */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "#c8874a" }}
        />
        <input
          type="text"
          placeholder="Search coffee, beans, pastries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl border
                     text-sm outline-none transition-all duration-200"
          style={{
            borderColor: "#f5deb3",
            backgroundColor: "white",
            color: "#3d1f0a",
          }}
          onFocus={(e) => e.target.style.borderColor = "#a0522d"}
          onBlur={(e) => e.target.style.borderColor = "#f5deb3"}
        />
        {/* Clear search button */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       hover:opacity-60 transition-opacity"
            style={{ color: "#c8874a" }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Category Filter Tabs ─────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {/* All tab */}
        <button
          onClick={() => setActiveCategory("all")}
          className="px-4 py-2.5 rounded-xl text-sm font-bold
                     whitespace-nowrap transition-all duration-200"
          style={{
            backgroundColor: activeCategory === "all" ? "#a0522d" : "white",
            color: activeCategory === "all" ? "white" : "#7b3f1e",
            border: "2px solid",
            borderColor: activeCategory === "all" ? "#a0522d" : "#f5deb3",
          }}
        >
          All
        </button>

        {/* Category tabs */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id.toString())}
            className="px-4 py-2.5 rounded-xl text-sm font-bold
                       whitespace-nowrap transition-all duration-200"
            style={{
              backgroundColor: activeCategory === cat.id.toString()
                ? "#a0522d" : "white",
              color: activeCategory === cat.id.toString()
                ? "white" : "#7b3f1e",
              border: "2px solid",
              borderColor: activeCategory === cat.id.toString()
                ? "#a0522d" : "#f5deb3",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}