/**
 * BREW HAVEN - Auth Context
 * Manages user authentication state across the app
 * Provides: user, login, register, logout, loading
 */

import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

// Create the context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ─────────────────────────────────────────
  // State
  // ─────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────
  // On app load — check if user is logged in
  // ─────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("bh_token");
      const savedUser = localStorage.getItem("bh_user");

      if (token && savedUser) {
        try {
          // Verify token is still valid with backend
          const response = await api.get("/auth/me");
          setUser(response.data.data.user);
        } catch (error) {
          // Token invalid — clear storage
          localStorage.removeItem("bh_token");
          localStorage.removeItem("bh_user");
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // ─────────────────────────────────────────
  // Login Function
  // ─────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data.data;

      // Save to localStorage
      localStorage.setItem("bh_token", token);
      localStorage.setItem("bh_user", JSON.stringify(user));

      // Update state
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // ─────────────────────────────────────────
  // Register Function
  // ─────────────────────────────────────────
  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const { user, token } = response.data.data;

      // Save to localStorage
      localStorage.setItem("bh_token", token);
      localStorage.setItem("bh_user", JSON.stringify(user));

      // Update state
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // ─────────────────────────────────────────
  // Logout Function
  // ─────────────────────────────────────────
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("bh_token");
    localStorage.removeItem("bh_user");

    // Clear state
    setUser(null);

    // Redirect to home
    window.location.href = "/";
  };

  // ─────────────────────────────────────────
  // Update User Function
  // ─────────────────────────────────────────
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("bh_user", JSON.stringify(updatedUser));
  };

  // ─────────────────────────────────────────
  // Helper flags
  // ─────────────────────────────────────────
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isCustomer = user?.role === "CUSTOMER";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isCustomer,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}