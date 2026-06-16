const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const { upload, handleUploadError } = require("../middleware/uploadMiddleware");

// ── Public routes ──────────────────────────────────────────────────────────────

// GET all products (paginated, optional ?category=id filter)
router.get("/", getProducts);

// GET single product
router.get("/:id", getProductById);

// ── Admin routes ───────────────────────────────────────────────────────────────

// CREATE product — auth + image upload + upload error handler + controller
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  handleUploadError,
  createProduct
);

// UPDATE product — auth + optional image upload + upload error handler + controller
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  handleUploadError,
  updateProduct
);

// DELETE product (soft delete)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;