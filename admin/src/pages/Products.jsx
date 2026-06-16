import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage]         = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(page); }, [page]);

  const fetchProducts = async (p = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/products?page=${p}&limit=20`);
      // Handle both paginated and legacy response shape
      const items = res.data.products ?? res.data;
      setProducts(items);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/products/${deleteId}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteId));
      toast.success("Product removed");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Products</h2>
          <p className="page-subtitle">
            {pagination ? `${pagination.total} products` : `${products.length} products`}
          </p>
        </div>
        <Link to="/products/add">
          <button className="btn btn-primary">➕ Add Product</button>
        </Link>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spin" /><span>Loading products…</span></div>
      ) : products.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <span className="admin-empty-icon">🌰</span>
            <h3>No products yet</h3>
            <p>Start by adding your first product to the store.</p>
            <button className="btn btn-primary" onClick={() => navigate("/products/add")}>
              ➕ Add Product
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>COD</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{ width: 44, height: 44, objectFit: "contain", background: "var(--cream)", borderRadius: 8, padding: 4, flexShrink: 0 }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray">
                        {typeof p.categoryId === "object" ? p.categoryId?.name : "—"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "var(--saffron)", fontFamily: "var(--font-display)", fontSize: 15 }}>
                        ₹{p.price}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.stock > 10 ? "badge-green" : p.stock > 0 ? "badge-saffron" : "badge-red"}`}>
                        {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.allowCOD ? "badge-green" : "badge-gray"}`}>
                        {p.allowCOD ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/products/edit/${p._id}`)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(p._id)}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      <DeleteConfirmModal
        open={Boolean(deleteId)}
        title="Remove product"
        description="This will soft-delete the product. It won't appear in the store but order history is preserved."
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
};

export default Products;