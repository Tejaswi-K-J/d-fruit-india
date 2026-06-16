import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import UpdateOrderStatus from "../components/UpdateOrderStatus";
import PaymentStatusBadge from "../components/PaymentStatusBadge";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading order details...</p>;
  }

  if (!order) {
    return <p style={{ padding: 20 }}>Order not found.</p>;
  }

  return (
    <div style={{ padding: 24, color: "#e5e7eb" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 20,
          background: "transparent",
          border: "none",
          color: "#60a5fa",
          cursor: "pointer",
        }}
      >
        ← Back to Orders
      </button>

      <h2>Order Details</h2>

      {/* ORDER SUMMARY */}
      <div
        style={{
          marginTop: 16,
          background: "#020617",
          padding: 18,
          borderRadius: 12,
        }}
      >
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Customer:</strong> {order.userId?.email || "Guest"}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p style={{ textTransform: "capitalize" }}>
          <strong>Order Status:</strong> {order.orderStatus}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <strong>Payment Status:</strong>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p>
          <strong>Placed On:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* UPDATE ORDER STATUS */}
      <UpdateOrderStatus
        orderId={order._id}
        currentStatus={order.orderStatus}
        onSuccess={fetchOrder}
      />

      {/* PRODUCTS */}
      <h3 style={{ marginTop: 28 }}>Products</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {order.products.map((p, idx) => (
          <div
            key={idx}
            style={{
              background: "#0f172a",
              padding: 14,
              borderRadius: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>
                ₹{p.price} × {p.quantity}
              </div>
            </div>
            <div style={{ fontWeight: 600 }}>
              ₹{p.price * p.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* ADDRESS */}
      <h3 style={{ marginTop: 28 }}>Delivery Address</h3>
      <div
        style={{
          background: "#020617",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <p>{order.address?.name}</p>
        <p>{order.address?.phone}</p>
        <p>
          {order.address?.street}, {order.address?.city}
        </p>
        <p>{order.address?.pincode}</p>
      </div>
    </div>
  );
};

export default OrderDetails;
