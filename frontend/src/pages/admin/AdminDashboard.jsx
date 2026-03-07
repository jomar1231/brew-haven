import { useState, useEffect } from "react";
import { ShoppingBag, Users, Package, DollarSign } from "lucide-react";
import api from "../../api/axios";
import { formatPrice } from "../../utils/helpers";
import { PageLoader } from "../../components/ui/Spinner";

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get("/orders/stats"),
          api.get("/orders?limit=5"),
        ]);
        setStats(statsRes.data.data.stats);
        setOrders(ordersRes.data.data.orders);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const statCards = [
    { label: "Total Revenue",   value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: "#16a34a", bg: "#f0fdf4" },
    { label: "Total Orders",    value: stats?.totalOrders    || 0,             icon: ShoppingBag, color: "#2563eb", bg: "#eff6ff" },
    { label: "Total Customers", value: stats?.totalCustomers || 0,             icon: Users,       color: "#a0522d", bg: "#faefd8" },
    { label: "Total Products",  value: stats?.totalProducts  || 0,             icon: Package,     color: "#7c3aed", bg: "#f5f3ff" },
  ];

  return (
    <div>
      <h2 style={{
        fontFamily: "Playfair Display, serif",
        fontSize: "1.75rem", fontWeight: "bold",
        color: "#3d1f0a", marginBottom: "1.5rem",
      }}>
        Dashboard Overview
      </h2>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem", marginBottom: "2rem",
      }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            backgroundColor: "white", borderRadius: "16px",
            padding: "1.25rem", boxShadow: "0 2px 8px rgba(61,31,10,0.06)",
            display: "flex", alignItems: "center", gap: "1rem",
          }}>
            <div style={{
              width: "48px", height: "48px", backgroundColor: card.bg,
              borderRadius: "12px", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <card.icon size={22} style={{ color: card.color }} />
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "#7b3f1e", marginBottom: "0.25rem" }}>
                {card.label}
              </p>
              <p style={{
                fontSize: "1.4rem", fontWeight: "bold",
                color: "#3d1f0a", fontFamily: "Playfair Display, serif",
              }}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Summary */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "0.75rem", marginBottom: "2rem",
      }}>
        {[
          { label: "Pending",   value: stats?.pendingOrders,   color: "#854d0e", bg: "#fef9c3" },
          { label: "Preparing", value: stats?.preparingOrders, color: "#1e40af", bg: "#dbeafe" },
          { label: "Completed", value: stats?.completedOrders, color: "#166534", bg: "#dcfce7" },
          { label: "Cancelled", value: stats?.cancelledOrders, color: "#991b1b", bg: "#fee2e2" },
        ].map((s) => (
          <div key={s.label} style={{
            backgroundColor: s.bg, borderRadius: "12px",
            padding: "1rem", textAlign: "center",
          }}>
            <p style={{
              fontSize: "1.5rem", fontWeight: "bold",
              color: s.color, fontFamily: "Playfair Display, serif",
            }}>
              {s.value || 0}
            </p>
            <p style={{ fontSize: "0.75rem", color: s.color, fontWeight: "bold" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div style={{
        backgroundColor: "white", borderRadius: "16px",
        padding: "1.25rem", boxShadow: "0 2px 8px rgba(61,31,10,0.06)",
      }}>
        <h3 style={{
          fontFamily: "Playfair Display, serif", fontSize: "1.25rem",
          fontWeight: "bold", color: "#3d1f0a", marginBottom: "1rem",
        }}>
          Recent Orders
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #faefd8" }}>
                {["Order ID", "Customer", "Items", "Total", "Status"].map((h) => (
                  <th key={h} style={{
                    padding: "0.5rem 0.75rem", textAlign: "left",
                    fontSize: "0.75rem", fontWeight: "bold",
                    color: "#7b3f1e", textTransform: "uppercase",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #faefd8" }}>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "bold", color: "#3d1f0a" }}>
                    #{order.id}
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#5c2e12" }}>
                    {order.user?.name}
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#5c2e12" }}>
                    {order.items?.length} item(s)
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "bold", color: "#a0522d" }}>
                    {formatPrice(order.total)}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{
                      padding: "0.2rem 0.6rem", borderRadius: "999px",
                      fontSize: "0.7rem", fontWeight: "bold",
                      ...getStatusStyle(order.status),
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getStatusStyle(status) {
  const map = {
    PENDING:   { backgroundColor: "#fef9c3", color: "#854d0e" },
    PREPARING: { backgroundColor: "#dbeafe", color: "#1e40af" },
    COMPLETED: { backgroundColor: "#dcfce7", color: "#166534" },
    CANCELLED: { backgroundColor: "#fee2e2", color: "#991b1b" },
  };
  return map[status] || { backgroundColor: "#f3f4f6", color: "#374151" };
}