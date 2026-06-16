import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AddCategoryModal = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/categories", { name });
      toast.success("Category added");
      setName("");
      onSuccess(); // refetch categories
      onClose();
    } catch (error) {
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display:'sflex',
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
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Add Category</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              marginBottom: 16,
              border: "1px solid #333",
              background: "#000",
              color: "#fff",
            }}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 6,
                background: "#1f2937",
                color: "#fff",
                border: "none",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 6,
                background: "#2563eb",
                color: "#fff",
                border: "none",
              }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
