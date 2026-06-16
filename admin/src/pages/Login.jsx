import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/admin/login`, { email, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--forest)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-body)",
    }}>
      {/* Dot pattern */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}/>

      {/* Card */}
      <div style={{
        background: "var(--white)",
        borderRadius: "var(--r-xl)",
        padding: "44px 40px",
        width: "100%",
        maxWidth: 420,
        position: "relative",
        zIndex: 1,
        boxShadow: "var(--shadow-xl)",
      }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56,
            background: "var(--saffron)",
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
            margin: "0 auto 14px",
          }}>🌿</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--ink)", marginBottom: 4 }}>
            Admin Login
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--ink-muted)" }}>D Fruit India Admin Panel</p>
        </div>

        {error && (
          <div style={{
            background: "var(--ruby-light)",
            border: "1px solid rgba(192,57,43,0.2)",
            color: "var(--ruby)",
            borderRadius: "var(--r-sm)",
            padding: "10px 14px",
            fontSize: 13.5,
            marginBottom: 18,
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dfruitindia.com"
              required
              style={{
                padding: "11px 14px",
                border: "1.5px solid var(--border-dark)",
                borderRadius: "var(--r-sm)",
                background: "var(--cream)",
                color: "var(--ink)",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                outline: "none",
                transition: "border-color 160ms",
              }}
              onFocus={e => e.target.style.borderColor = "var(--saffron)"}
              onBlur={e => e.target.style.borderColor = "var(--border-dark)"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                padding: "11px 14px",
                border: "1.5px solid var(--border-dark)",
                borderRadius: "var(--r-sm)",
                background: "var(--cream)",
                color: "var(--ink)",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                outline: "none",
                transition: "border-color 160ms",
              }}
              onFocus={e => e.target.style.borderColor = "var(--saffron)"}
              onBlur={e => e.target.style.borderColor = "var(--border-dark)"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: "13px",
              background: loading ? "var(--ink-muted)" : "var(--saffron)",
              color: "white",
              border: "none",
              borderRadius: "var(--r-sm)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 160ms",
              letterSpacing: "0.02em",
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;