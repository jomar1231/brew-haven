import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../components/ui/Toast";
import { PageLoader } from "../../components/ui/Spinner";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const { showToast }   = useToast();

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data.categories);
    } catch (error) {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { showToast("Name is required", "warning"); return; }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, form);
        showToast("Category updated!", "success");
      } else {
        await api.post("/categories", form);
        showToast("Category created!", "success");
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    try {
      await api.delete(`/categories/${cat.id}`);
      showToast("Category deleted", "success");
      fetchCategories();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete", "error");
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
          Categories ({categories.length})
        </h2>
        <button onClick={openCreate} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          backgroundColor: "#a0522d", color: "white", border: "none",
          borderRadius: "10px", padding: "0.625rem 1.25rem",
          fontWeight: "bold", fontSize: "0.875rem", cursor: "pointer",
        }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1rem",
      }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{
            backgroundColor: "white", borderRadius: "16px",
            padding: "1.25rem", boxShadow: "0 2px 8px rgba(61,31,10,0.06)",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: "0.5rem",
            }}>
              <h3 style={{
                fontFamily: "Playfair Display, serif", fontWeight: "bold",
                color: "#3d1f0a", fontSize: "1.1rem",
              }}>
                {cat.name}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => openEdit(cat)} style={{
                  padding: "0.375rem", backgroundColor: "#faefd8",
                  color: "#a0522d", border: "none", borderRadius: "8px", cursor: "pointer",
                }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(cat)} style={{
                  padding: "0.375rem", backgroundColor: "#fee2e2",
                  color: "#991b1b", border: "none", borderRadius: "8px", cursor: "pointer",
                }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#7b3f1e", marginBottom: "0.75rem" }}>
              {cat.description || "No description"}
            </p>
            <span style={{
              fontSize: "0.75rem", backgroundColor: "#faefd8",
              color: "#a0522d", padding: "0.2rem 0.6rem",
              borderRadius: "999px", fontWeight: "bold",
            }}>
              {cat._count?.products || 0} products
            </span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "1rem",
        }}>
          <div style={{
            backgroundColor: "white", borderRadius: "20px",
            padding: "1.5rem", width: "100%", maxWidth: "420px",
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: "1.25rem",
            }}>
              <h3 style={{
                fontFamily: "Playfair Display, serif", fontSize: "1.25rem",
                fontWeight: "bold", color: "#3d1f0a",
              }}>
                {editing ? "Edit Category" : "Add Category"}
              </h3>
              <button onClick={() => setShowModal(false)} style={{
                background: "none", border: "none", cursor: "pointer", color: "#7b3f1e",
              }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{
                  display: "block", fontSize: "0.75rem", fontWeight: "bold",
                  color: "#7b3f1e", marginBottom: "0.35rem", textTransform: "uppercase",
                }}>
                  Category Name *
                </label>
                <input
                  type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Drinks"
                  style={{
                    width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px",
                    border: "1.5px solid #f5deb3", fontSize: "0.875rem",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block", fontSize: "0.75rem", fontWeight: "bold",
                  color: "#7b3f1e", marginBottom: "0.35rem", textTransform: "uppercase",
                }}>
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description..." rows={3}
                  style={{
                    width: "100%", padding: "0.625rem 0.875rem", borderRadius: "8px",
                    border: "1.5px solid #f5deb3", fontSize: "0.875rem",
                    outline: "none", boxSizing: "border-box", resize: "none",
                  }}
                />
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