import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../components/ui/Toast";
import { formatPrice } from "../../utils/helpers";
import { PageLoader } from "../../components/ui/Spinner";

const labelStyle = {
  display: "block", fontSize: "0.75rem", fontWeight: "bold",
  color: "#7b3f1e", marginBottom: "0.35rem", textTransform: "uppercase",
};
const inputStyle = {
  width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px",
  border: "1.5px solid #f5deb3", fontSize: "0.875rem",
  outline: "none", boxSizing: "border-box", backgroundColor: "#fffef7",
};

export default function AdminProducts() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "",
    image: "", badge: "", stock: "100",
    available: true, categoryId: "",
  });
  const { showToast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/products?limit=50"),
        api.get("/categories"),
      ]);
      setProducts(prodRes.data.data.products);
      setCategories(catRes.data.data.categories);
    } catch (error) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", image: "", badge: "", stock: "100", available: true, categoryId: "" });
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "", description: product.description || "",
      price: product.price || "", image: product.image || "",
      badge: product.badge || "", stock: product.stock || "100",
      available: product.available, categoryId: product.categoryId || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      showToast("Name, price and category are required", "warning");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, form);
        showToast("Product updated!", "success");
      } else {
        await api.post("/products", form);
        showToast("Product created!", "success");
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      showToast("Product deleted", "success");
      fetchData();
    } catch (error) {
      showToast("Failed to delete", "error");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem",
      }}>
        <h2 style={{
          fontFamily: "Playfair Display, serif", fontSize: "1.75rem",
          fontWeight: "bold", color: "#3d1f0a",
        }}>
          Products ({products.length})
        </h2>
        <button onClick={openCreate} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          backgroundColor: "#a0522d", color: "white", border: "none",
          borderRadius: "10px", padding: "0.625rem 1.25rem",
          fontWeight: "bold", fontSize: "0.875rem", cursor: "pointer",
        }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: "white", borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(61,31,10,0.06)", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fdf8f0" }}>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} style={{
                    padding: "0.75rem 1rem", textAlign: "left",
                    fontSize: "0.75rem", fontWeight: "bold",
                    color: "#7b3f1e", textTransform: "uppercase",
                    borderBottom: "2px solid #faefd8",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid #faefd8" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=100&q=80"}
                        alt={product.name}
                        style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover" }}
                      />
                      <p style={{ fontWeight: "bold", fontSize: "0.875rem", color: "#3d1f0a" }}>
                        {product.name}
                      </p>
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#5c2e12" }}>
                    {product.category?.name}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: "bold", color: "#a0522d", fontSize: "0.875rem" }}>
                    {formatPrice(product.price)}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#3d1f0a" }}>
                    {product.stock}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{
                      padding: "0.2rem 0.6rem", borderRadius: "999px",
                      fontSize: "0.7rem", fontWeight: "bold",
                      backgroundColor: product.available ? "#dcfce7" : "#fee2e2",
                      color: product.available ? "#166534" : "#991b1b",
                    }}>
                      {product.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => openEdit(product)} style={{
                        padding: "0.375rem 0.625rem", backgroundColor: "#faefd8",
                        color: "#a0522d", border: "none", borderRadius: "8px", cursor: "pointer",
                      }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(product)} style={{
                        padding: "0.375rem 0.625rem", backgroundColor: "#fee2e2",
                        color: "#991b1b", border: "none", borderRadius: "8px", cursor: "pointer",
                      }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "1rem",
        }}>
          <div style={{
            backgroundColor: "white", borderRadius: "20px", padding: "1.5rem",
            width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "1.25rem",
            }}>
              <h3 style={{
                fontFamily: "Playfair Display, serif", fontSize: "1.25rem",
                fontWeight: "bold", color: "#3d1f0a",
              }}>
                {editing ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowModal(false)} style={{
                background: "none", border: "none", cursor: "pointer", color: "#7b3f1e",
              }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Product Name *</label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Signature Espresso" style={inputStyle} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Description</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product..." rows={3}
                  style={{ ...inputStyle, resize: "none" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <label style={labelStyle}>Price ($) *</label>
                  <input type="number" step="0.01" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Stock</label>
                  <input type="number" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="100" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Category *</label>
                <select value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  style={inputStyle}>
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Image URL</label>
                <input type="url" value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..." style={inputStyle} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Badge</label>
                <input type="text" value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="e.g. Bestseller, New" style={inputStyle} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <input type="checkbox" id="available" checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  style={{ width: "18px", height: "18px", accentColor: "#a0522d" }} />
                <label htmlFor="available" style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#7b3f1e" }}>
                  Product is available for purchase
                </label>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: "0.75rem", backgroundColor: "#faefd8",
                  color: "#a0522d", border: "none", borderRadius: "10px",
                  fontWeight: "bold", cursor: "pointer",
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{
                  flex: 1, padding: "0.75rem", backgroundColor: "#a0522d",
                  color: "white", border: "none", borderRadius: "10px",
                  fontWeight: "bold", cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}>
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}