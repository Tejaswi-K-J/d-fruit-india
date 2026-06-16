const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/statsController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// GET /api/stats — admin only
router.get("/", authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;