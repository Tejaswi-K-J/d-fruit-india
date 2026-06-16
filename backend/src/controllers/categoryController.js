const Category = require("../models/Category");
const mongoose = require("mongoose");

/**
 * @desc    Create category (Admin)
 * @route   POST /api/categories
 */
exports.createCategory = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const slug = req.body.slug?.trim().toLowerCase();

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    if (!slug) {
      return res.status(400).json({ message: "Category slug is required" });
    }
    // Slug must be URL-safe
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({
        message: "Slug can only contain lowercase letters, numbers, and hyphens",
      });
    }

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "A category with this slug already exists" });
    }

    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (error) {
    console.error("[createCategory]", error.message);
    res.status(500).json({ message: "Category creation failed" });
  }
};

/**
 * @desc    Get all active categories (Public)
 * @route   GET /api/categories
 * @note    Categories are few by nature — pagination kept optional via ?all=true
 *          Default returns all active categories for dropdowns/filters.
 *          Pass ?page=1&limit=20 if you ever need paginated admin view.
 */
exports.getCategories = async (req, res) => {
  try {
    // If caller explicitly wants paginated (e.g. admin list), honour it
    if (req.query.page || req.query.limit) {
      const page  = Math.max(1, parseInt(req.query.page)  || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 20);
      const skip  = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        Category.find({ isActive: true }).sort({ name: 1 }).skip(skip).limit(limit),
        Category.countDocuments({ isActive: true }),
      ]);

      return res.json({
        categories,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
    }

    // Default: return all active categories (suitable for dropdowns — typically < 50)
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error("[getCategories]", error.message);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/**
 * @desc    Delete category (Admin — soft delete)
 * @route   DELETE /api/categories/:id
 */
exports.deleteCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Category removed successfully" });
  } catch (error) {
    console.error("[deleteCategory]", error.message);
    res.status(500).json({ message: "Failed to delete category" });
  }
};