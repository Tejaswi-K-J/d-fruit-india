import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import "../admin.css";

const navItems = [
  { to: "/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/products",   icon: "🌰", label: "Products" },
  { to: "/categories", icon: "🗂",  label: "Categories" },
  { to: "/orders",     icon: "📦", label: "Orders" },
  { to: "/messages",   icon: "💬", label: "Messages" },
];

const pageTitles = {
  "/dashboard":  "Dashboard",
  "/products":   "Products",
  "/categories": "Categories",
  "/orders":     "Orders",
  "/messages":   "Messages",
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? "Admin";

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="admin-layout">

      {/* ── SIDEBAR ──────────────────────── */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">🌿</div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-name">D Fruit India</span>
              <span className="sidebar-brand-sub">Admin Panel</span>
            </div>
          </div>
        </div>

        <div className="sidebar-section-label">Navigation</div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-link-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────── */}
      <main className="admin-content">

        {/* TOPBAR */}
        <div className="admin-topbar">
          <h1 className="topbar-title">{title}</h1>
          <div className="topbar-actions">
            <div className="admin-avatar">A</div>
          </div>
        </div>

        {/* PAGE */}
        <Outlet />

      </main>
    </div>
  );
};

export default AdminLayout;