const DeleteConfirmModal = ({
  open,
  title = "Confirm delete",
  description = "Are you sure you want to delete this item?",
  onCancel,
  onConfirm,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#111",
          padding: 24,
          borderRadius: 12,
          width: 360,
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        }}
      >
        <h3 style={{ marginBottom: 8 }}>{title}</h3>
        <p style={{ color: "#888", marginBottom: 20 }}>{description}</p>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 8,
              background: "#1f2937",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 8,
              background: "#7f1d1d",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
