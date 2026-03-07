/**
 * BREW HAVEN - Navbar Component
 * Responsive navigation with cart count and auth state
 */

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Coffee, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  const handleNavClick = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-coffee-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ───────────────────────────── */}
          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-2 group"
          >
            <div className="bg-coffee-600 p-2 rounded-lg group-hover:bg-coffee-700 transition-colors">
              <Coffee size={20} className="text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-coffee-800">
                Brew Haven
              </span>
              <span className="hidden sm:block text-xs text-coffee-400 -mt-1">
                Premium Coffee
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation ─────────────── */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              onClick={handleNavClick}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors
                ${isActive("/")
                  ? "bg-coffee-100 text-coffee-700"
                  : "text-coffee-600 hover:bg-coffee-50"
                }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={handleNavClick}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors
                ${isActive("/menu")
                  ? "bg-coffee-100 text-coffee-700"
                  : "text-coffee-600 hover:bg-coffee-50"
                }`}
            >
              Menu
            </Link>
          </div>

          {/* ── Right Side Actions ──────────────── */}
          <div className="flex items-center gap-2">

            {/* Cart Button */}
            {!isAdmin && (
              <Link
                to="/cart"
                onClick={handleNavClick}
                className="relative p-2 rounded-lg text-coffee-600
                           hover:bg-coffee-50 transition-colors"
              >
                <ShoppingCart size={22} />
                {/* Cart item count badge */}
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1
                                   bg-coffee-600 text-white
                                   text-xs font-bold rounded-full
                                   w-5 h-5 flex items-center justify-center">
                    {cart.itemCount > 9 ? "9+" : cart.itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                {/* User Avatar Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg
                             hover:bg-coffee-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-coffee-600 rounded-full
                                  flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-bold text-coffee-700">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white
                                  rounded-xl shadow-lg border border-coffee-100
                                  animate-fadeIn z-50">
                    <div className="p-3 border-b border-coffee-100">
                      <p className="text-sm font-bold text-coffee-800">
                        {user?.name}
                      </p>
                      <p className="text-xs text-coffee-400">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={handleNavClick}
                          className="flex items-center gap-2 px-3 py-2
                                     rounded-lg text-sm text-coffee-700
                                     hover:bg-coffee-50 transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={handleNavClick}
                          className="flex items-center gap-2 px-3 py-2
                                     rounded-lg text-sm text-coffee-700
                                     hover:bg-coffee-50 transition-colors"
                        >
                          <User size={16} />
                          My Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); handleNavClick(); }}
                        className="w-full flex items-center gap-2 px-3 py-2
                                   rounded-lg text-sm text-red-600
                                   hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="px-4 py-2 text-sm font-bold text-coffee-600
                             hover:bg-coffee-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="px-4 py-2 text-sm font-bold text-white
                             bg-coffee-600 hover:bg-coffee-700
                             rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-coffee-600
                         hover:bg-coffee-50 transition-colors"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────── */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-coffee-100
                          py-3 animate-fadeIn">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={handleNavClick}
                className="px-4 py-2 rounded-lg text-sm font-bold
                           text-coffee-700 hover:bg-coffee-50"
              >
                Home
              </Link>
              <Link
                to="/menu"
                onClick={handleNavClick}
                className="px-4 py-2 rounded-lg text-sm font-bold
                           text-coffee-700 hover:bg-coffee-50"
              >
                Menu
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={handleNavClick}
                    className="px-4 py-2 rounded-lg text-sm font-bold
                               text-coffee-700 hover:bg-coffee-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleNavClick}
                    className="px-4 py-2 rounded-lg text-sm font-bold
                               text-white bg-coffee-600 hover:bg-coffee-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}