import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import ProductImageUpload from "../components/ProductImageUpload";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [allowCOD, setAllowCOD] = useState(true); // ✅ NEW
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  // Fetch existing product
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data;

      setName(p.name || "");
      setDescription(p.description || "");
      setPrice(p.price || "");
      setStock(p.stock || "");
      setAllowCOD(p.allowCOD ?? true); // ✅ READ FROM BACKEND

      if (p.categoryId && typeof p.categoryId === "object") {
        setCategoryId(p.categoryId._id);
      } else {
        setCategoryId(p.categoryId || "");
      }

      setImageUrl(p.imageUrl || null);
    } catch (error) {
      toast.error("Failed to load product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId || typeof categoryId !== "string") {
      toast.error("Please select a valid category");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);
    formData.append("allowCOD", allowCOD); // ✅ SEND TO BACKEND

    if (image) {
      formData.append("image", image);
    }

    try {
      setSaving(true);

      await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully");
      navigate("/products");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading product...</p>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>Edit Product</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <br /><br />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <br /><br />

        {/* ✅ COD Toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={allowCOD}
            onChange={(e) => setAllowCOD(e.target.checked)}
          />
          Allow Cash on Delivery
        </label>

        <br /><br />

        {/* Image preview + replace */}
        <ProductImageUpload
          imageUrl={imageUrl}
          onImageSelect={(file) => setImage(file)}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
