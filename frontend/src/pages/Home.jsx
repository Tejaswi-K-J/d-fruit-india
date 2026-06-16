import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/product/ProductCard";
import Hero from "../components/hero/Hero";
import "./Home.css";

const Home = ({ showCategories }) => {
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isProductsPage = location.pathname === "/products";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const searchQuery = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const items = res.data.products ?? res.data;
      setProducts(items);
      setFilteredProducts(items);
    } catch (err) {
      console.error("Products fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Categories fetch failed", err);
    }
  };

  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        const catId = typeof p.categoryId === "object" ? p.categoryId._id : p.categoryId;
        return catId === selectedCategory;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, products, searchQuery]);

  return (
    <>
      {isHomePage && <Hero />}

      {/* ── PRODUCTS SECTION ──────────────────────── */}
      <section className="products-section" id="products">
        <div className="products-container">

          {/* HEADER */}
          <div className="products-header">
            <div className="products-header-left">
              <span className="products-eyebrow">🌰 Our Collection</span>
              <h2>
                {searchQuery
                  ? <>Results for <span>"{searchQuery}"</span></>
                  : <>Premium Dry Fruits &amp; <span>Snacks</span></>
                }
              </h2>
              {!searchQuery && (
                <p>Explore our range of nutritious dry fruits, nuts, and wholesome snacks</p>
              )}
            </div>

            {!loading && (
              <div className="products-count-badge">
                🌿 {filteredProducts.length} products
              </div>
            )}
          </div>

          <div className={`products-layout ${isProductsPage && showCategories ? "has-sidebar" : ""}`}>

            {/* SIDEBAR */}
            {isProductsPage && showCategories && (
              <aside className="products-sidebar">
                <h4 className="sidebar-title">🗂 Categories</h4>
                <div className="category-list">
                  <button
                    className={`category-item ${selectedCategory === "all" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      className={`category-item ${selectedCategory === cat._id ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat._id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </aside>
            )}

            {/* GRID */}
            <div className="products-main">
              {loading && (
                <div className="products-loading">
                  <div className="loading-spinner" />
                  <span>Loading products…</span>
                </div>
              )}

              {!loading && filteredProducts.length === 0 && (
                <div className="products-empty">
                  <h4>No products found</h4>
                  <p>Try a different category or search term</p>
                </div>
              )}

              {!loading && filteredProducts.length > 0 && (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ─────────────────────────── */}
      <section className="home-trust-section">
        <div className="trust-container">
          <span className="trust-eyebrow">Why D Fruit India</span>
          <h2>The Freshest Choice for Your Family</h2>
          <p className="trust-subtext">
            Premium dry fruits and wellness products you can trust — cultivated naturally,
            packed hygienically, delivered fast across India.
          </p>

          <div className="trust-grid">
            {[
              { icon: "🌱", title: "100% Natural", desc: "No artificial additives, preservatives, or colouring. Just pure, honest nutrition." },
              { icon: "🧼", title: "Hygienic Packaging", desc: "Every product is packed under strict quality standards for maximum freshness." },
              { icon: "🚚", title: "Fast Delivery", desc: "Pan-India delivery with careful packaging to preserve quality." },
              { icon: "🇮🇳", title: "Made for India", desc: "Curated for Indian families, palates, and wellness traditions." },
            ].map((card) => (
              <div key={card.title} className="trust-card">
                <span className="trust-card-icon">{card.icon}</span>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;