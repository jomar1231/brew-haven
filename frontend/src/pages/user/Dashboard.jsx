import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, MapPin, Phone } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/ui/Toast";
import { formatPrice, formatDate } from "../../utils/helpers";
import { PageLoader } from "../../components/ui/Spinner";

export default function Dashboard() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("orders");
  const [profile, setProfile] = useState({ name: "", phone: "", address: "" });
  const [saving, setSaving]   = useState(false);
  const { user, updateUser }  = useAuth();
  const { showToast }         = useToast();

  useEffect(() => {
    fetchOrders();
    if (user) {
      setProfile({
        name:    user.name    || "",
        phone:   user.phone   || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", profile);
      updateUser(res.data.data.user);
      showToast("Profile updated!", "success");
    } catch (error) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div style={{ backgroundColor: "#fdf8f0", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #3d1f0a, #7b3f1e)",
        padding: "40px 0",
      }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "56px", height: "56px",
              backgroundColor: "#a0522d", borderRadius: "50%",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.5rem",
              fontWeight: "bold", color: "white",
            }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h1 style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.75rem", fontWeight: "bold", color: "white",
              }}>
                {user?.name}
              </h1>
              <p style={{ color: "#d4a96a", fontSize: "0.875rem" }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "0.5rem",
          marginBottom: "2rem",
          borderBottom: "2px solid #faefd8",
        }}>
          {[
            { id: "orders",  label: "My Orders",  icon: ShoppingBag },
            { id: "profile", label: "My Profile", icon: User },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.75rem 1.25rem", fontWeight: "bold",
                fontSize: "0.875rem", border: "none",
                borderBottom: tab === t.id ? "2px solid #a0522d" : "2px solid transparent",
                backgroundColor: "transparent",
                color: tab === t.id ? "#a0522d" : "#7b3f1e",
                cursor: "pointer", marginBottom: "-2px",
              }}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <ShoppingBag size={48} style={{ color: "#d4a96a", margin: "0 auto 1rem" }} />
                <h3 style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.5rem", color: "#3d1f0a", marginBottom: "0.5rem",
                }}>
                  No Orders Yet
                </h3>
                <p style={{ color: "#a0522d", marginBottom: "1.5rem" }}>
                  Start browsing our menu!
                </p>
                <Link to="/menu" style={{
                  backgroundColor: "#a0522d", color: "white",
                  padding: "0.75rem 1.5rem", borderRadius: "10px",
                  fontWeight: "bold", textDecoration: "none",
                }}>
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orders.map((order) => (
                  <div key={order.id} style={{
                    backgroundColor: "white", borderRadius: "16px",
                    padding: "1.25rem",
                    boxShadow: "0 2px 8px rgba(61,31,10,0.06)",
                  }}>
                    {/* Order Header */}
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: "1rem",
                      flexWrap: "wrap", gap: "0.5rem",
                    }}>
                      <div>
                        <p style={{
                          fontWeight: "bold", color: "#3d1f0a",
                          fontFamily: "Playfair Display, serif",
                        }}>
                          Order #{order.id}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#a0522d" }}>
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <span style={{
                        padding: "0.25rem 0.75rem", borderRadius: "999px",
                        fontSize: "0.75rem", fontWeight: "bold",
                        ...getStatusStyle(order.status),
                      }}>
                        {order.status}
                      </span>
                    </div>

                    {/* Items */}
                    <div style={{
                      borderTop: "1px solid #faefd8",
                      borderBottom: "1px solid #faefd8",
                      padding: "0.75rem 0", marginBottom: "0.75rem",
                    }}>
                      {order.items.map((item) => (
                        <div key={item.id} style={{
                          display: "flex", justifyContent: "space-between",
                          fontSize: "0.875rem", marginBottom: "0.25rem",
                        }}>
                          <span style={{ color: "#5c2e12" }}>
                            {item.product.name} × {item.quantity}
                          </span>
                          <span style={{ fontWeight: "bold", color: "#3d1f0a" }}>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                    }}>
                      <span style={{ fontSize: "0.875rem", color: "#7b3f1e" }}>Total</span>
                      <span style={{
                        fontWeight: "bold", fontSize: "1.1rem",
                        color: "#a0522d", fontFamily: "Playfair Display, serif",
                      }}>
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <div style={{
            backgroundColor: "white", borderRadius: "20px",
            padding: "2rem", boxShadow: "0 2px 8px rgba(61,31,10,0.06)",
            maxWidth: "500px",
          }}>
            <h2 style={{
              fontFamily: "Playfair Display, serif", fontSize: "1.5rem",
              fontWeight: "bold", color: "#3d1f0a", marginBottom: "1.5rem",
            }}>
              Edit Profile
            </h2>
            <form onSubmit={handleProfileSave}>
              {[
                { label: "Full Name",    key: "name",    type: "text", placeholder: "Your full name"    },
                { label: "Phone Number", key: "phone",   type: "tel",  placeholder: "09XX XXX XXXX"     },
                { label: "Address",      key: "address", type: "text", placeholder: "Your full address" },
              ].map((field) => (
                <div key={field.key} style={{ marginBottom: "1.25rem" }}>
                  <label style={{
                    display: "block", fontSize: "0.8rem", fontWeight: "bold",
                    color: "#7b3f1e", marginBottom: "0.4rem", textTransform: "uppercase",
                  }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={profile[field.key]}
                    onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                      border: "1.5px solid #f5deb3", fontSize: "0.9rem",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "100%", padding: "0.875rem",
                  backgroundColor: "#a0522d", color: "white",
                  border: "none", borderRadius: "10px",
                  fontSize: "0.95rem", fontWeight: "bold",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}
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