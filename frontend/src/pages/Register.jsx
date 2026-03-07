import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/Toast";

export default function Register() {
  const [form, setForm]         = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { register, isAuthenticated } = useAuth();
  const { showToast }           = useToast();
  const navigate                = useNavigate();

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      showToast("Please fill in all fields", "warning");
      return;
    }
    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters", "warning");
      return;
    }
    if (form.password !== form.confirm) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      showToast("Account created! Welcome to Brew Haven ☕", "success");
      navigate("/");
    } else {
      showToast(result.error, "error");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#fdf8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "64px", height: "64px",
            backgroundColor: "#a0522d",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}>
            <Coffee size={32} color="white" />
          </div>
          <h1 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#3d1f0a",
            marginBottom: "0.25rem",
          }}>
            Create Account
          </h1>
          <p style={{ color: "#a0522d", fontSize: "0.9rem" }}>
            Join the Brew Haven community
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(61,31,10,0.08)",
        }}>
          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block", fontSize: "0.8rem",
                fontWeight: "bold", color: "#7b3f1e",
                marginBottom: "0.4rem", textTransform: "uppercase",
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Juan dela Cruz"
                style={{
                  width: "100%", padding: "0.75rem 1rem",
                  borderRadius: "10px", border: "1.5px solid #f5deb3",
                  fontSize: "0.9rem", outline: "none",
                  boxSizing: "border-box", backgroundColor: "#fffef7",
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block", fontSize: "0.8rem",
                fontWeight: "bold", color: "#7b3f1e",
                marginBottom: "0.4rem", textTransform: "uppercase",
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: "100%", padding: "0.75rem 1rem",
                  borderRadius: "10px", border: "1.5px solid #f5deb3",
                  fontSize: "0.9rem", outline: "none",
                  boxSizing: "border-box", backgroundColor: "#fffef7",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block", fontSize: "0.8rem",
                fontWeight: "bold", color: "#7b3f1e",
                marginBottom: "0.4rem", textTransform: "uppercase",
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{
                display: "block", fontSize: "0.8rem",
                fontWeight: "bold", color: "#7b3f1e",
                marginBottom: "0.4rem", textTransform: "uppercase",
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat your password"
                style={{
                  width: "100%", padding: "0.75rem 1rem",
                  borderRadius: "10px", border: "1.5px solid #f5deb3",
                  fontSize: "0.9rem", outline: "none",
                  boxSizing: "border-box", backgroundColor: "#fffef7",
                }}
              />
            </div>

            {/* Submit */}
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
              {loading ? "Creating Account..." : "Create Account ☕"}
            </button>
          </form>

          <div style={{ borderTop: "1px solid #faefd8", margin: "1.5rem 0" }} />

          <p style={{
            textAlign: "center",
            fontSize: "0.875rem",
            color: "#7b3f1e",
          }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#a0522d",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}