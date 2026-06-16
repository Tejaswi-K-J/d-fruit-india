import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const ORDER_STATUSES = ["placed", "packed", "shipped", "delivered"];

const UpdateOrderStatus = ({ orderId, currentStatus, onSuccess }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!status) return;

    try {
      setLoading(true);

      await api.put(`/orders/${orderId}/status`, {
        orderStatus: status,
      });

      toast.success("Order status updated");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: 20,
        background: "#1c1c1c",
        padding: 14,
        borderRadius: 8,
      }}
    >
      <h4 style={{ marginBottom: 10 }}>Update Order Status</h4>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;
