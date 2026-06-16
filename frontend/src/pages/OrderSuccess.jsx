import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Ordersuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart after successful order
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>

        <h2>Order Placed Successfully!</h2>

        <p>
          Thank you for shopping with <strong>D Fruit India</strong>.
          <br />
          Your order has been placed and will be processed shortly.
        </p>

        <div className="success-actions">
          <button
            className="success-btn primary"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>

          <button
            className="success-btn secondary"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
