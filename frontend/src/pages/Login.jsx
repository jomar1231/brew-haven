import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate                = useNavigate();

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    const result = await login(form.email, form.password);
    if (result.success) {
      if (result.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#fdf8f0",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "2rem 1rem",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "64px", height: "64px", backgroundColor: "#a0522d",
            borderRadius: "16px", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 1rem",
          }}>
            <Coffee size={32} color="white" />
          </div>
          <h1 style={{
            fontFamily: "Playfair Display, serif", fontSize: "2rem",
            fontWeight: "bold", color: "#3d1f0a", marginBottom: "0.25rem",
          }}>
            Welcome Back
          </h1>
          <p style={{ color: "#a0522d", fontSize: "0.9rem" }}>
            Sign in to your Brew Haven account
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: "white", borderRadius: "24px",
          padding: "2rem", boxShadow: "0 4px 20px rgba(61,31,10,0.08)",
        }}>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "#fee2e2", color: "#991b1b",
              padding: "0.75rem 1rem", borderRadius: "10px",
              marginBottom: "1rem", fontSize: "0.875rem", fontWeight: "bold",
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block", fontSize: "0.8rem", fontWeight: "bold",
                color: "#7b3f1e", marginBottom: "0.4rem", textTransform: "uppercase",
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                  border: "1.5px solid #f5deb3", fontSize: "0.9rem",
                  outline: "none", boxSizing: "border-box", backgroundColor: "#fffef7",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block", fontSize: "0.8rem", fontWeight: "bold",
                color: "#7b3f1e", marginBottom: "0.4rem", textTransform: "uppercase",
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  style={{
                    width: "100%", padding: "0.75rem 3rem 0.75rem 1rem",
                    borderRadius: "10px", border: "1.5px solid #f5deb3",
                    fontSize: "0.9rem", outline: "none",
                    boxSizing: "border-box", backgroundColor: "#fffef7",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "#a0522d",
                  }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "0.875rem",
                backgroundColor: loading ? "#c8874a" : "#a0522d",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "0.95rem", fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign In ☕"}
            </button>
          </form>

          <div style={{ borderTop: "1px solid #faefd8", margin: "1.5rem 0" }} />

          {/* Demo Credentials */}
          <div style={{
            backgroundColor: "#fdf8f0", borderRadius: "10px",
            padding: "1rem", marginBottom: "1.5rem",
          }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#7b3f1e", marginBottom: "0.5rem" }}>
              Demo Credentials:
            </p>
            <p style={{ fontSize: "0.75rem", color: "#a0522d" }}>
              👤 Customer: customer@brewhaven.com / customer123
            </p>
            <p style={{ fontSize: "0.75rem", color: "#a0522d" }}>
              ⚙️ Admin: admin@brewhaven.com / admin123
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#7b3f1e" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#a0522d", fontWeight: "bold", textDecoration: "none" }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}