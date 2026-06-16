const Product = require("../models/Product");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

// ── Helper: extract Cloudinary public_id from a stored URL ────────────────────
// Cloudinary URLs look like:
// https://res.cloudinary.com/<cloud>/image/upload/v123456/d-fruit-products/abc123.jpg
// The public_id is everything after /upload/vXXXXXX/ — e.g. "d-fruit-products/abc123"
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    // Strip the version segment (v1234567/) if present, then remove file extension
    const withoutVersion = parts[1].replace(/^v\d+\//, "");
    const withoutExt = withoutVersion.replace(/\.[^.]+$/, "");
    return withoutExt;
  } catch {
    return null;
  }
};

// ── Helper: safely delete a Cloudinary image ──────────────────────────────────
const deleteFromCloudinary = async (imageUrl) => {
  const publicId = getPublicIdFromUrl(imageUrl);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Non-fatal — log and continue. Old image cleanup should never block the main operation.
    console.warn("[Cloudinary cleanup failed]", publicId, err.message);
  }
};

/* ── CREATE PRODUCT (Admin) ──────────────────────────────────────────────────── */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;

    // ── Validate required fields ───────────────────────────────────────────────
    if (!name?.trim()) {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (!description?.trim()) {
      return res.status(400).json({ message: "Product description is required" });
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ message: "A valid price greater than 0 is required" });
    }
    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "A valid category is required" });
    }
    if (!req.file?.path) {
      return res.status(400).json({ message: "A product image is required" });
    }

    const allowCOD = req.body.allowCOD === "true" || req.body.allowCOD === true;
    const stockVal = Math.max(0, parseInt(req.body.stock, 10) || 0);

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: stockVal,
      categoryId,
      imageUrl: req.file.path,
      allowCOD,
      // Parse arrays sent as JSON strings from multipart form data
      ingredients: parseJsonArray(req.body.ingredients),
      benefits: parseJsonArray(req.body.benefits),
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("[createProduct]", error.message);
    res.status(500).json({ message: "Product creation failed" });
  }
};

/* ── GET ALL PRODUCTS (Public) — paginated ───────────────────────────────────── */
exports.getProducts = async (req, res) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)     || 1);
    const limit    = Math.min(100, parseInt(req.query.limit)  || 20);
    const skip     = (page - 1) * limit;
    const category = req.query.category; // optional filter by categoryId

    const filter = { isActive: true };
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.categoryId = category;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[getProducts]", error.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* ── GET SINGLE PRODUCT (Public) ─────────────────────────────────────────────── */
exports.getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("categoryId", "name slug");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("[getProductById]", error.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

/* ── UPDATE PRODUCT (Admin) ──────────────────────────────────────────────────── */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (req.body.categoryId && !mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    if (req.body.price !== undefined) {
      const p = Number(req.body.price);
      if (isNaN(p) || p <= 0) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ── Build update object ────────────────────────────────────────────────────
    const updateData = {};

    if (req.body.name)        updateData.name        = req.body.name.trim();
    if (req.body.description) updateData.description = req.body.description.trim();
    if (req.body.price)       updateData.price       = Number(req.body.price);
    if (req.body.stock !== undefined) updateData.stock = Math.max(0, parseInt(req.body.stock, 10) || 0);
    if (req.body.categoryId)  updateData.categoryId  = req.body.categoryId;
    if (req.body.allowCOD !== undefined) {
      updateData.allowCOD = req.body.allowCOD === "true" || req.body.allowCOD === true;
    }
    if (req.body.ingredients) updateData.ingredients = parseJsonArray(req.body.ingredients);
    if (req.body.benefits)    updateData.benefits    = parseJsonArray(req.body.benefits);

    // ── Handle image replacement ───────────────────────────────────────────────
    if (req.file?.path) {
      // Delete the OLD image from Cloudinary before saving the new one
      await deleteFromCloudinary(existingProduct.imageUrl);
      updateData.imageUrl = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    res.json(updatedProduct);
  } catch (error) {
    console.error("[updateProduct]", error.message);
    res.status(500).json({ message: "Product update failed" });
  }
};

/* ── DELETE PRODUCT (Admin — soft delete) ────────────────────────────────────── */
exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Soft delete — keeps DB record and Cloudinary image intact for order history
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("[deleteProduct]", error.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/* ── Utility ──────────────────────────────────────────────────────────────────── */
// Multipart form data sends arrays as JSON strings — parse them safely
const parseJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};