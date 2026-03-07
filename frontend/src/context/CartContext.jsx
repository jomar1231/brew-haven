/**
 * BREW HAVEN - Cart Context
 * Manages shopping cart state across the app
 * Syncs with backend API for authenticated users
 */

import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

// Create the context
export const CartContext = createContext(null);

export function CartProvider({ children }) {
  // ─────────────────────────────────────────
  // State
  // ─────────────────────────────────────────
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useContext(AuthContext);

  // ─────────────────────────────────────────
  // Fetch cart when user logs in
  // ─────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when logged out
      setCart({ items: [], total: 0, itemCount: 0 });
    }
  }, [isAuthenticated]);

  // ─────────────────────────────────────────
  // Get Cart from Backend
  // ─────────────────────────────────────────
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCart(response.data.data.cart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Add Item to Cart
  // ─────────────────────────────────────────
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await api.post("/cart", { productId, quantity });
      setCart(response.data.data.cart);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add to cart",
      };
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Update Item Quantity
  // ─────────────────────────────────────────
  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await api.put(`/cart/${itemId}`, { quantity });
      setCart(response.data.data.cart);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update cart",
      };
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Remove Item from Cart
  // ─────────────────────────────────────────
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      await api.delete(`/cart/${itemId}`);
      // Remove item from local state immediately
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
        total: prev.items
          .filter((item) => item.id !== itemId)
          .reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0),
      }));
      // Refresh cart from backend
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to remove item",
      };
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Clear Entire Cart
  // ─────────────────────────────────────────
  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setCart({ items: [], total: 0, itemCount: 0 });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  // ─────────────────────────────────────────
  // Helper: Check if product is in cart
  // ─────────────────────────────────────────
  const isInCart = (productId) => {
    return cart.items.some((item) => item.product.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}