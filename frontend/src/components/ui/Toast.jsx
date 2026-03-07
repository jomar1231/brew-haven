/**
 * BREW HAVEN - Toast Notification Component
 * Usage: import toast system via context
 */

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

// ── Toast Context ────────────────────────
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Remove a toast manually
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50
                      flex flex-col gap-2 max-w-sm w-full px-4">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Single Toast Item ────────────────────
function ToastItem({ toast, onRemove }) {
  const styles = {
    success: {
      bg: "#f0fdf4",
      border: "#86efac",
      icon: <CheckCircle size={18} color="#16a34a" />,
      text: "#166534",
    },
    error: {
      bg: "#fef2f2",
      border: "#fca5a5",
      icon: <XCircle size={18} color="#dc2626" />,
      text: "#991b1b",
    },
    warning: {
      bg: "#fffbeb",
      border: "#fcd34d",
      icon: <AlertCircle size={18} color="#d97706" />,
      text: "#92400e",
    },
  };

  const style = styles[toast.type] || styles.success;

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl shadow-lg
                 border animate-fadeIn"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {style.icon}
      </div>

      {/* Message */}
      <p className="text-sm font-bold flex-1"
         style={{ color: style.text }}>
        {toast.message}
      </p>

      {/* Close Button */}
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 hover:opacity-60 transition-opacity"
        style={{ color: style.text }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ── useToast Hook ────────────────────────
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}