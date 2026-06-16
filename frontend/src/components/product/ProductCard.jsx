import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const categoryName =
    typeof product.categoryId === "object"
      ? product.categoryId?.name
      : null;

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product._id}`)}
    >
      {/* BADGES */}
      <div className="card-badges">
        <span className="badge-natural">🌿 Natural</span>
        {product.allowCOD && <span className="badge-cod">COD Available</span>}
      </div>

      {/* IMAGE */}
      <div className="product-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>

      {/* INFO */}
      <div className="product-info">
        {categoryName && (
          <span className="product-category-tag">{categoryName}</span>
        )}

        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        <div className="product-price-row">
          <span className="product-price">₹{product.price}</span>
          <span className="product-price-unit">/ pack</span>
        </div>

        <button
          className="view-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product._id}`);
          }}
        >
          View Product →
        </button>
      </div>
    </div>
  );
};

export default ProductCard;