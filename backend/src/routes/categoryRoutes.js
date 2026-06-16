const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/categoryController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Public
router.get("/", getCategories);

// Admin
router.post("/", authMiddleware, adminMiddleware, createCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;