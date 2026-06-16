import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statCards = (s) => [
  { label: "Total Revenue",    value: `₹${(s.totalRevenue || 0).toLocaleString("en-IN")}`, icon: "💰", color: "green",  sub: "From paid orders" },
  { label: "Total Orders",     value: s.totalOrders,     icon: "📦", color: "saffron", sub: `${s.pendingOrders} need attention` },
  { label: "Products",         value: s.totalProducts,   icon: "🌰", color: "blue",    sub: "Active listings" },
  { label: "Categories",       value: s.totalCategories, icon: "🗂",  color: "purple",  sub: "Active categories" },
  { label: "Customers",        value: s.totalUsers,      icon: "👥", color: "green",   sub: "Registered users" },
  { label: "Messages",         value: s.totalMessages,   icon: "💬", color: "ruby",    sub: "Contact enquiries" },
];

const quickLinks = [
  { to: "/products/add", icon: "➕", label: "Add Product",    desc: "List a new product" },
  { to: "/orders",       icon: "📦", label: "View Orders",    desc: "Manage & update" },
  { to: "/messages",     icon: "💬", label: "View Messages",  desc: "Customer enquiries" },
  { to: "/categories",   icon: "🗂",  label: "Categories",    desc: "Manage categories" },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">

      {/* WELCOME */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Welcome back, Admin 👋</h2>
          <p className="page-subtitle">Here's what's happening with D Fruit India today.</p>
        </div>
        <Link to="/products/add">
          <button className="btn btn-primary">➕ Add Product</button>
        </Link>
      </div>

      {/* STAT CARDS */}
      {loading ? (
        <div className="admin-loading"><div className="spin" /><span>Loading stats…</span></div>
      ) : (
        <div className="stat-grid">
          {statCards(stats || {}).map((s) => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-value">{s.value ?? "—"}</div>
              <div className="stat-label">{s.label}</div>
              {s.sub && <div className="stat-sub">{s.sub}</div>}
            </div>
          ))}
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="admin-card" style={{ marginTop: 8 }}>
        <div className="card-header">
          <span className="card-title">Quick Actions</span>
        </div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {quickLinks.map((q) => (
            <Link key={q.to} to={q.to} style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--cream)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: "16px",
                cursor: "pointer",
                transition: "background 160ms, transform 160ms",
                textAlign: "center",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--cream-dark)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--cream)"; e.currentTarget.style.transform = ""; }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{q.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", marginBottom: 3 }}>{q.label}</div>
                <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{q.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;