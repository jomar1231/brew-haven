/**
 * BREW HAVEN - Cart Item Component
 * Single item row inside the cart page
 */

import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../ui/Toast";
import { formatPrice } from "../../utils/helpers";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const showToast = useToast();

  // ── Handle Quantity Change ───────────────
  const handleQuantityChange = async (newQty) => {
    if (newQty < 1) return;
    await updateQuantity(item.id, newQty);
  };

  // ── Handle Remove ────────────────────────
  const handleRemove = async () => {
    const result = await removeFromCart(item.id);
    if (result.success) {
      showToast(`${item.product.name} removed from cart`, "success");
    } else {
      showToast("Failed to remove item", "error");
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white
                    rounded-xl border"
         style={{ borderColor: "#faefd8" }}>

      {/* ── Product Image ──────────────────── */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.product.image ||
               "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80"}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Product Details ────────────────── */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm mb-0.5 truncate"
            style={{
              fontFamily: "Playfair Display, serif",
              color: "#3d1f0a",
            }}>
          {item.product.name}
        </h4>
        <p className="text-sm font-bold"
           style={{ color: "#a0522d" }}>
          {formatPrice(item.product.price)}
        </p>
      </div>

      {/* ── Quantity Controls ──────────────── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     transition-colors hover:opacity-80"
          style={{ backgroundColor: "#faefd8", color: "#7b3f1e" }}
        >
          <Minus size={14} />
        </button>

        <span className="w-8 text-center text-sm font-bold"
              style={{ color: "#3d1f0a" }}>
          {item.quantity}
        </span>

        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center
                     transition-colors hover:opacity-80"
          style={{ backgroundColor: "#faefd8", color: "#7b3f1e" }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* ── Item Total ─────────────────────── */}
      <div className="text-right min-w-16">
        <p className="font-bold text-sm"
           style={{
             fontFamily: "Playfair Display, serif",
             color: "#3d1f0a",
           }}>
          {formatPrice(parseFloat(item.product.price) * item.quantity)}
        </p>
      </div>

      {/* ── Remove Button ──────────────────── */}
      <button
        onClick={handleRemove}
        className="p-2 rounded-lg transition-colors hover:opacity-80"
        style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}