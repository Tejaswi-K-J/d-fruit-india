import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = ({ onToggleCategories }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setQuery("");
    setOpen(false);
  };

  const handleCategoriesClick = () => {
    navigate("/products");
    onToggleCategories();
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* BRAND */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">🌿</div>
          <div className="brand-text">
            <span className="brand-name">D Fruit India</span>
            <span className="brand-tagline">Pure · Natural · Nourishing</span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="navbar-menu">
          <Link to="/" className={`menu-link ${isActive("/") ? "active" : ""}`}>Home</Link>
          <button type="button" className="menu-link" onClick={handleCategoriesClick}>
            Categories
          </button>
          <Link to="/about" className={`menu-link ${isActive("/about") ? "active" : ""}`}>About</Link>
          <Link to="/contact" className={`menu-link ${isActive("/contact") ? "active" : ""}`}>Contact</Link>
        </div>

        {/* ACTIONS */}
        <div className="navbar-actions">
          <form className="nav-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">🔍</button>
          </form>

          <Link to="/cart" className="nav-cart-btn" aria-label="Cart">🛒</Link>

          <button
            className="hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="mobile-search">
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">🔍</button>
        </form>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>🏠 Home</Link>
        <button onClick={handleCategoriesClick}>🗂 Categories</button>
        <Link to="/about" onClick={() => setOpen(false)}>🌿 About</Link>
        <Link to="/contact" onClick={() => setOpen(false)}>📞 Contact</Link>
        <Link to="/cart" onClick={() => setOpen(false)}>🛒 Cart</Link>
      </div>
    </nav>
  );
};

export default Navbar;