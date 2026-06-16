import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const STATUS_BADGE = {
  PLACED:    { cls: "badge-saffron", label: "Placed" },
  PACKED:    { cls: "badge-blue",    label: "Packed" },
  SHIPPED:   { cls: "badge-purple",  label: "Shipped" },
  DELIVERED: { cls: "badge-green",   label: "Delivered" },
  CANCELLED: { cls: "badge-red",     label: "Cancelled" },
};

const PAYMENT_BADGE = {
  PENDING: { cls: "badge-saffron", label: "Pending" },
  PAID:    { cls: "badge-green",   label: "Paid" },
  FAILED:  { cls: "badge-red",     label: "Failed" },
};

const METHOD_BADGE = {
  COD:  { cls: "badge-blue",   label: "COD" },
  UPI:  { cls: "badge-purple", label: "UPI" },
  CARD: { cls: "badge-gray",   label: "Card" },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => { fetchOrders(page); }, [page]);

  const fetchOrders = async (p = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/orders?page=${p}&limit=20`);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Orders</h2>
          <p className="page-subtitle">
            {pagination ? `${pagination.total} total orders` : "All customer orders"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spin" /><span>Loading orders…</span></div>
      ) : orders.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <span className="admin-empty-icon">📦</span>
            <h3>No orders yet</h3>
            <p>Orders will appear here once customers start purchasing.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Pay Status</th>
                  <th>Order Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const oStatus = STATUS_BADGE[order.orderStatus] || { cls: "badge-gray", label: order.orderStatus };
                  const pStatus = PAYMENT_BADGE[order.paymentStatus] || { cls: "badge-gray", label: order.paymentStatus };
                  const method  = METHOD_BADGE[order.paymentMethod]  || { cls: "badge-gray", label: order.paymentMethod };
                  return (
                    <tr key={order._id}>
                      <td>
                        <span style={{ fontFamily: "monospace", fontSize: 13, color: "var(--forest)" }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 13.5 }}>{order.userId?.name || "Guest"}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{order.userId?.email || "—"}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: "var(--saffron)", fontFamily: "var(--font-display)", fontSize: 15 }}>
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td><span className={`badge ${method.cls}`}>{method.label}</span></td>
                      <td><span className={`badge ${pStatus.cls}`}>{pStatus.label}</span></td>
                      <td><span className={`badge ${oStatus.cls}`}>{oStatus.label}</span></td>
                      <td style={{ fontSize: 13, color: "var(--ink-muted)", whiteSpace: "nowrap" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td>
                        <Link to={`/orders/${order._id}`}>
                          <button className="btn btn-outline btn-sm">View →</button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span style={{ padding: "6px 14px", fontSize: 13, color: "var(--ink-muted)" }}>
                Page {page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;