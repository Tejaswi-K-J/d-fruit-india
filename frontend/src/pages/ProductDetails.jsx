import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const currentProduct = res.data;
        setProduct(currentProduct);

        // Fetch related by category
        const allRes = await api.get("/products");
        const allProducts = allRes.data.products ?? allRes.data;
        const currentCatId =
          typeof currentProduct.categoryId === "object"
            ? currentProduct.categoryId._id
            : currentProduct.categoryId;

        const related = allProducts.filter((p) => {
          if (!p.categoryId) return false;
          const pCatId = typeof p.categoryId === "object" ? p.categoryId._id : p.categoryId;
          return pCatId === currentCatId && p._id !== currentProduct._id;
        });

        setRelatedProducts(related.slice(0, 4));
      } catch (error) {
        console.error("Failed to load product", error);
      }
    };

    fetchData();
  }, [id]);

  const increaseQty = () => setQuantity((q) => Math.min(q + 1, product?.stock || 99));
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 99);
      toast.success("Cart quantity updated!");
    } else {
      cart.push({ ...product, quantity });
      toast.success("Added to cart! 🛒");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const categoryName =
    product && typeof product.categoryId === "object"
      ? product.categoryId?.name
      : null;

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="product-details-container">
          <div className="product-loading">
            <div className="loading-spinner" />
            <span>Loading product…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">

        {/* BREADCRUMB */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/products">Products</Link>
          {categoryName && (
            <>
              <span className="breadcrumb-sep">›</span>
              <span>{categoryName}</span>
            </>
          )}
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* MAIN */}
        <div className="product-details-card">

          {/* IMAGE */}
          <div className="product-image-section">
            <div className="product-image-frame">
              <div className="product-image-badges">
                <span className="img-badge img-badge-natural">🌿 Natural</span>
                {product.allowCOD && (
                  <span className="img-badge img-badge-cod">COD Available</span>
                )}
              </div>
              <img src={product.imageUrl} alt={product.name} />
            </div>
          </div>

          {/* INFO */}
          <div className="product-info-section">
            {categoryName && (
              <span className="detail-category-tag">🗂 {categoryName}</span>
            )}

            <h1 className="product-title">{product.name}</h1>

            <div className="product-price-section">
              <span className="product-price">₹{product.price}</span>
              <span className="product-price-label">per pack · incl. taxes</span>
            </div>

            {/* STOCK */}
            <div className={`stock-indicator ${product.stock > 0 ? "stock-in" : "stock-out"}`}>
              {product.stock > 0
                ? `✓ In Stock (${product.stock} available)`
                : "✕ Out of Stock"
              }
            </div>

            <p className="product-description">{product.description}</p>

            {product.ingredients?.length > 0 && (
              <div className="product-meta">
                <h4>🌾 Ingredients</h4>
                <ul>
                  {product.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            {product.benefits?.length > 0 && (
              <div className="product-meta">
                <h4>💚 Benefits</h4>
                <ul>
                  {product.benefits.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            {/* QUANTITY */}
            {product.stock > 0 && (
              <div className="quantity-section">
                <span className="quantity-label">Quantity</span>
                <div className="quantity-controls">
                  <button onClick={decreaseQty} aria-label="Decrease quantity">−</button>
                  <span className="quantity-value">{quantity}</span>
                  <button onClick={increaseQty} aria-label="Increase quantity">+</button>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="cta-section">
              <button
                className="buy-now-btn"
                disabled={product.stock === 0}
                onClick={() => navigate("/checkout", { state: { product, quantity } })}
              >
                ⚡ Buy Now · ₹{product.price * quantity}
              </button>
              <button
                className="add-to-cart-btn"
                disabled={product.stock === 0}
                onClick={addToCart}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {relatedProducts.length > 0 && (
          <div className="related-section">
            <div className="related-header">
              <h3>You might also like</h3>
              <span>From the same category</span>
            </div>
            <div className="related-grid">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  className="related-card"
                  onClick={() => navigate(`/product/${item._id}`)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={item.imageUrl} alt={item.name} />
                  <p>{item.name}</p>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;