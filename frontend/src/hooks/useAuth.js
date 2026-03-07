/**
 * BREW HAVEN - useAuth Hook
 * Shortcut to access AuthContext anywhere in the app
 * Usage: const { user, login, logout } = useAuth();
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}