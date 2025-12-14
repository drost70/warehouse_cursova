import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import TransactionsPage from "./pages/TransactionsPage";
import LoginPage from "./pages/LoginPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminTransactionsPage from "./pages/AdminTransactionsPage";
import ReportsPage from "./pages/ReportsPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import ContractorsPage from "./pages/ContractorsPage";
import SuppliersPage from "./pages/SuppliersPage";
import ActsPage from "./pages/ActsPage";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/Notification";
import "./styles/global.css";

export default function App() {
  const { token, role, logout } = useAuth() || {};

  return (
    <NotificationProvider>
      <div className="app-container" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        <img 
          src="/photo1.jpg" 
          alt="фон" 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1
          }}
        />

        <header className="app-header">
          <nav>
            <Link to="/">Головна</Link>
            {role === "admin" && (
              <>
                <Link to="/reports">Звіти</Link>
                <Link to="/invoices">Накладні</Link>
                <Link to="/contractors">Контрагенти</Link>
                <Link to="/suppliers">Постачальники</Link>
                <Link to="/acts">Акти</Link>
                <Link to="/admin/products">Керування товарами</Link>
                <Link to="/admin/transactions">Керування транзакціями</Link>
              </>
            )}
            {role === "worker" && (
              <>
                <Link to="/products">Керування товарами</Link>
                <Link to="/transactions">Керування транзакціями</Link>
              </>
            )}
          </nav>

          <div>
            {token ? (
              <button className="logout-btn" onClick={logout}>Вийти</button>
            ) : (
              <Link to="/login" className="login-btn">Увійти</Link>
            )}
          </div>
        </header>

        <main style={{ flex: 1, padding: "2rem" }}>
          <Routes>
            <Route path="/" element={<div className="homepage"><HomePage /></div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/products" element={<ProtectedRoute allowedRoles={["admin"]}><AdminProductsPage /></ProtectedRoute>} />
            <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTransactionsPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute allowedRoles={["worker"]}><ProductsPage /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute allowedRoles={["worker"]}><TransactionsPage /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute allowedRoles={["admin"]}><InvoicesPage /></ProtectedRoute>} />
            <Route path="/invoices/:invoiceId" element={<ProtectedRoute allowedRoles={["admin"]}><InvoiceDetailsPage /></ProtectedRoute>} />
            <Route path="/contractors" element={<ProtectedRoute allowedRoles={["admin"]}><ContractorsPage /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute allowedRoles={["admin"]}><SuppliersPage /></ProtectedRoute>} />
            <Route path="/acts" element={<ProtectedRoute allowedRoles={["admin"]}><ActsPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={["admin"]}><ReportsPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Notification />

        <footer className="app-footer">
          &copy; 2025 Система складського обліку. Всі права захищені.
        </footer>
      </div>
    </NotificationProvider>
  );
}
