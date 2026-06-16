import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchMessages(page); }, [page]);

  const fetchMessages = async (p = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/contact?page=${p}&limit=20`);
      setMessages(res.data.messages);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/contact/${id}`);
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Messages</h2>
          <p className="page-subtitle">
            {pagination ? `${pagination.total} total messages` : "Customer enquiries"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spin" /><span>Loading messages…</span></div>
      ) : messages.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <span className="admin-empty-icon">💬</span>
            <h3>No messages yet</h3>
            <p>Customer enquiries from the contact form will appear here.</p>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((msg) => (
              <div key={msg._id} className="admin-card">
                <div className="card-header">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{msg.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-muted)", marginTop: 2 }}>
                      📞 {msg.phone} &nbsp;·&nbsp; {new Date(msg.createdAt).toLocaleString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </div>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteMessage(msg._id)}
                    disabled={deletingId === msg._id}
                  >
                    {deletingId === msg._id ? "Deleting…" : "🗑 Delete"}
                  </button>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span style={{ padding: "6px 14px", fontSize: 13, color: "var(--ink-muted)" }}>Page {page} of {pagination.totalPages}</span>
              <button className="btn btn-outline btn-sm" disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Messages;