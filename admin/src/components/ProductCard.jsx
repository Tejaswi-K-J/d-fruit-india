import { Link } from "react-router-dom";

const ProductCard = ({ product, onDelete }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />

      <h4>{product.name}</h4>
      <p>₹{product.price}</p>

      <div className="product-actions">
        <Link to={`/products/edit/${product._id}`}>
          <button>Edit</button>
        </Link>

        <button
          className="delete"
          onClick={() => onDelete(product._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
