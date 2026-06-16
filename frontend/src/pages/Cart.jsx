import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateQuantity = (id, type) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === id) {
        const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: newQty > 1 ? newQty : 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.error("Item removed");
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="cart-empty-btn">
              Browse Products →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* HEADER */}
        <div className="cart-page-header">
          <span className="cart-eyebrow">🛒 Shopping Bag</span>
          <h2 className="cart-title">
            Your Cart
            <span className="cart-item-count">({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
          </h2>
        </div>

        <div className="cart-layout">

          {/* ITEMS */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-item-img"
                />

                <div className="cart-info">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-price">₹{item.price} per pack</p>

                  <div className="cart-qty">
                    <button onClick={() => updateQuantity(item._id, "dec")} aria-label="Decrease">−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, "inc")} aria-label="Increase">+</button>
                  </div>

                  <p className="cart-item-subtotal">₹{item.price * item.quantity}</p>

                  <button className="remove-btn" onClick={() => removeItem(item._id)}>
                    ✕ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Items ({totalItems})</span>
              <span>₹{total}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span style={{ color: "var(--forest)", fontWeight: 600 }}>FREE</span>
            </div>

            <div className="savings-pill">🎉 You save on free delivery!</div>

            <div className="summary-row total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() => {
                // ✅ FIXED: pass ALL cart items, not just cartItems[0]
                navigate("/checkout", {
                  state: { cartItems, total },
                });
              }}
            >
              Proceed to Checkout →
            </button>

            <p className="checkout-note">🔒 Safe & secure checkout</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;