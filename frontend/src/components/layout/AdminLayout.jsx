/**
 * BREW HAVEN - Admin Layout
 * Sidebar layout wrapper for all admin pages
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Coffee, LayoutDashboard, Package,
  ShoppingBag, Tag, LogOut, Menu, X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/admin",            icon: LayoutDashboard, label: "Dashboard"  },
    { to: "/admin/products",   icon: Package,         label: "Products"   },
    { to: "/admin/orders",     icon: ShoppingBag,     label: "Orders"     },
    { to: "/admin/categories", icon: Tag,             label: "Categories" },
  ];

  return (
    <div className="min-h-screen bg-coffee-50 flex">

      {/* ── Sidebar ─────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-coffee-900
                    transform transition-transform duration-200
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:relative lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4
                        border-b border-coffee-800">
          <div className="flex items-center gap-2">
            <div className="bg-coffee-600 p-2 rounded-lg">
              <Coffee size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">
                Brew Haven
              </p>
              <p className="text-xs text-coffee-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-coffee-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b border-coffee-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-coffee-600 rounded-full
                            flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {user?.name}
              </p>
              <p className="text-xs text-coffee-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-3 flex-1">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5
                              rounded-lg text-sm font-bold transition-colors
                              ${isActive(link.to)
                                ? "bg-coffee-600 text-white"
                                : "text-coffee-300 hover:bg-coffee-800 hover:text-white"
                              }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-coffee-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5
                       rounded-lg text-sm font-bold text-coffee-300
                       hover:bg-red-900 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Main Content ────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-coffee-100
                           px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-coffee-600
                       hover:bg-coffee-50 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-display font-bold text-coffee-800">
            Admin Dashboard
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}