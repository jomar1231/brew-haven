import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./components/ui/Toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminLayout from "./components/layout/AdminLayout";

// Route Guards
function PrivateRoute({ children }) {
  const token = localStorage.getItem("bh_token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  return children;
}

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("bh_user") || "{}");
  if (!user || user.role !== "ADMIN") {
    window.location.href = "/";
    return null;
  }
  return children;
}

const NotFound = () => (
  <div style={{
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Playfair Display, serif",
    color: "#3d1f0a",
  }}>
    <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
    <p style={{ marginBottom: "1rem" }}>Page not found</p>
    <a href="/" style={{ color: "#a0522d", fontWeight: "bold" }}>
      Go Home
    </a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fdf8f0",
            }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/"            element={<Home />}          />
                  <Route path="/menu"        element={<Menu />}          />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login"       element={<Login />}         />
                  <Route path="/register"    element={<Register />}      />

                  {/* Customer Routes */}
                  <Route path="/cart"      element={<PrivateRoute><Cart /></PrivateRoute>}     />
                  <Route path="/checkout"  element={<PrivateRoute><Checkout /></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminProducts />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminOrders />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminCategories />
                      </AdminLayout>
                    </AdminRoute>
                  } />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;