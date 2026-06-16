import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import AddCategoryModal from "../components/AddCategoryModal";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Categories</h2>
        <button onClick={() => setOpenAddModal(true)}>
          Add Category
        </button>
      </div>

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {categories.map((cat) => (
            <div
              key={cat._id}
              style={{
                background: "#d3e2e1",
                padding: 12,
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{cat.name}</span>

              <button
                onClick={() => deleteCategory(cat._id)}
                style={{ color: "red" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <AddCategoryModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={fetchCategories}
      />
    </div>
  );
};

export default Categories;
