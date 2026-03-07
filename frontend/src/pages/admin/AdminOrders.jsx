import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useToast } from "../../components/ui/Toast";
import { formatPrice, formatDate } from "../../utils/helpers";
import { PageLoader } from "../../components/ui/Spinner";

const STATUSES = ["ALL", "PENDING", "PREPARING", "COMPLETED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("ALL");
  const [updating, setUpdating] = useState(null);
  const { showToast }           = useToast();

  useEffect(() => { fetchOrders(); }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter !== "ALL" ? `?status=${filter}` : "";
      const res = await api.get(`/orders${params}`);
      setOrders(res.data.data.orders);
    } catch (error) {
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order #${orderId} updated!`, "success");
      fetchOrders();
    } catch (error) {
      showToast("Failed to update order", "error");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h2 style={{
        fontFamily: "Playfair Display, serif", fontSize: "1.75rem",
        fontWeight: "bold", color: "#3d1f0a", marginBottom: "1.5rem",
      }}>
        Manage Orders
      </h2>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "0.5rem 1rem", borderRadius: "999px",
            fontWeight: "bold", fontSize: "0.8rem", border: "none", cursor: "pointer",
            backgroundColor: filter === s ? "#a0522d" : "#faefd8",
            color: filter === s ? "white" : "#a0522d",
          }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {orders.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "4rem",
              backgroundColor: "white", borderRadius: "16px",
            }}>
              <p style={{ color: "#a0522d", fontWeight: "bold" }}>No orders found</p>
            </div>
          ) : orders.map((order) => (
            <div key={order.id} style={{
              backgroundColor: "white", borderRadius: "16px",
              padding: "1.25rem", boxShadow: "0 2px 8px rgba(61,31,10,0.06)",
            }}>
              {/* Header */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: "0.75rem",
                flexWrap: "wrap", gap: "0.5rem",
              }}>
                <div>
                  <p style={{
                    fontWeight: "bold", color: "#3d1f0a",
                    fontFamily: "Playfair Display, serif", fontSize: "1rem",
                  }}>
                    Order #{order.id}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#a0522d" }}>
                    {order.user?.name} • {order.user?.email}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#7b3f1e" }}>
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Status Dropdown */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  disabled={updating === order.id}
                  style={{
                    padding: "0.375rem 0.75rem", borderRadius: "8px",
                    border: "1.5px solid #f5deb3", fontWeight: "bold",
                    fontSize: "0.8rem", cursor: "pointer",
                    backgroundColor: "#fdf8f0", color: "#a0522d", outline: "none",
                  }}
                >
                  {["PENDING", "PREPARING", "COMPLETED", "CANCELLED"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Items */}
              <div style={{
                borderTop: "1px solid #faefd8", borderBottom: "1px solid #faefd8",
                padding: "0.75rem 0", marginBottom: "0.75rem",
              }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "0.875rem", marginBottom: "0.25rem",
                  }}>
                    <span style={{ color: "#5c2e12" }}>
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span style={{ fontWeight: "bold", color: "#3d1f0a" }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", flexWrap: "wrap", gap: "0.5rem",
              }}>
                {order.shippingAddress && (
                  <p style={{ fontSize: "0.75rem", color: "#7b3f1e" }}>
                    📍 {order.shippingAddress}
                  </p>
                )}
                <p style={{
                  fontWeight: "bold", color: "#a0522d", marginLeft: "auto",
                  fontFamily: "Playfair Display, serif", fontSize: "1.1rem",
                }}>
                  Total: {formatPrice(order.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}