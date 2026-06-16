import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import "./Checkout.css";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const [billing, setBilling] = useState({
    email: "", firstName: "", lastName: "",
    street: "", city: "", pincode: "",
    country: "India", phone: "",
  });

  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  if (!state) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <p style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-muted)" }}>
            No items selected. <a href="/products">Browse products →</a>
          </p>
        </div>
      </div>
    );
  }

  // ── Support both single-product (from ProductDetails) and multi-item (from Cart)
  const cartItems = state.cartItems
    ? state.cartItems
    : [{ ...state.product, quantity: state.quantity }];

  const total = state.total ?? cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const set = (field) => (e) => setBilling({ ...billing, [field]: e.target.value });

  const handlePayment = async () => {
    const { email, firstName, lastName, street, city, pincode, phone } = billing;

    if (!email || !firstName || !lastName || !street || !city || !pincode || !phone) {
      toast.error("Please fill all delivery details");
      return;
    }

    if (paymentMethod === "card" && (!card.number || !card.name || !card.expiry || !card.cvv)) {
      toast.error("Please fill in your card details");
      return;
    }

    setLoading(true);
    try {
      await api.post("/orders/create", {
        products: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod: paymentMethod.toUpperCase(),
        address: {
          name: `${firstName} ${lastName}`,
          phone,
          street,
          city,
          pincode,
        },
        // totalAmount sent for reference only — backend recomputes it
        totalAmount: total,
      });

      // Clear cart
      localStorage.removeItem("cart");

      toast.success("Order placed successfully! 🎉");
      navigate("/success");
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to place order";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { id: "cod",  icon: "💵", name: "Cash on Delivery",  desc: "Pay when your order arrives" },
    { id: "upi",  icon: "📱", name: "UPI",               desc: "GPay, PhonePe, Paytm & more" },
    { id: "card", icon: "💳", name: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
  ];

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* HEADER */}
        <div className="checkout-header">
          <span className="checkout-eyebrow">🛍 Almost there</span>
          <h2 className="checkout-title">Checkout</h2>
        </div>

        {/* STEPS */}
        <div className="checkout-steps">
          <div className="checkout-step done">
            <span>✓</span> Cart
          </div>
          <div className="checkout-step active">
            <span>2</span> Delivery &amp; Payment
          </div>
          <div className="checkout-step">
            <span>3</span> Confirmation
          </div>
        </div>

        <div className="checkout-grid">

          {/* ── LEFT: FORM ──────────────────────── */}
          <div className="checkout-form-panel">

            {/* DELIVERY DETAILS */}
            <div className="form-section">
              <div className="form-section-header">
                <span>📦</span>
                <h3>Delivery Details</h3>
              </div>
              <div className="form-section-body">

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" placeholder="you@example.com" onChange={set("email")} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input className="form-input" placeholder="Raj" onChange={set("firstName")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input className="form-input" placeholder="Kumar" onChange={set("lastName")} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input className="form-input" placeholder="House no., street, area" onChange={set("street")} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" placeholder="Mumbai" onChange={set("city")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input className="form-input" placeholder="400001" onChange={set("pincode")} maxLength={6} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" placeholder="9876543210" onChange={set("phone")} maxLength={10} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select className="form-select" value={billing.country} onChange={set("country")}>
                      <option>India</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* PAYMENT */}
            <div className="form-section">
              <div className="form-section-header">
                <span>💳</span>
                <h3>Payment Method</h3>
              </div>
              <div className="form-section-body">

                <div className="payment-options">
                  {paymentOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className={`payment-option ${paymentMethod === opt.id ? "active" : ""}`}
                      onClick={() => setPaymentMethod(opt.id)}
                    >
                      <div className="payment-radio">
                        <div className="payment-radio-dot" />
                      </div>
                      <span style={{ fontSize: 22 }}>{opt.icon}</span>
                      <div className="payment-option-label">
                        <span className="payment-option-name">{opt.name}</span>
                        <span className="payment-option-desc">{opt.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="card-fields">
                    <input
                      className="form-input"
                      placeholder="Card number"
                      maxLength={16}
                      onChange={(e) => setCard({ ...card, number: e.target.value })}
                    />
                    <input
                      className="form-input"
                      placeholder="Cardholder name"
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                    />
                    <div className="form-row">
                      <input
                        className="form-input"
                        placeholder="MM / YY"
                        maxLength={5}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      />
                      <input
                        className="form-input"
                        placeholder="CVV"
                        maxLength={3}
                        type="password"
                        onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <button
                  className="place-order-btn"
                  style={{ marginTop: 20 }}
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Placing Order…" : `Place Order · ₹${total}`}
                </button>

                <p className="order-security-note">
                  🔒 Your information is safe and encrypted
                </p>

              </div>
            </div>

          </div>

          {/* ── RIGHT: SUMMARY ──────────────────── */}
          <div className="checkout-summary-panel">
            <div className="summary-panel-header">
              <h3>Order Summary ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</h3>
            </div>
            <div className="summary-panel-body">

              {cartItems.map((item) => (
                <div key={item._id} className="summary-product-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="summary-product-img"
                  />
                  <div className="summary-product-info">
                    <p className="summary-product-name">{item.name}</p>
                    <p className="summary-product-meta">₹{item.price} × {item.quantity}</p>
                    <p className="summary-product-price">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}

              <div className="summary-totals">
                <div className="summary-total-row">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="summary-total-row">
                  <span>Delivery</span>
                  <span style={{ color: "var(--forest)", fontWeight: 600 }}>FREE</span>
                </div>
                <div className="summary-grand-total">
                  <span>Total</span>
                  <strong>₹{total}</strong>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;