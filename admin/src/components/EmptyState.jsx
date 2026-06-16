const EmptyState = ({ title, description, actionText, onAction }) => {
  return (
    <div
      style={{
        marginTop: 60,
        textAlign: "center",
        color: "#ccc",
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <p style={{ marginBottom: 20, color: "#888" }}>{description}</p>

      {actionText && (
        <button
          onClick={onAction}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
