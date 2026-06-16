const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/orderController");

const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// ── Rate limiter ───────────────────────────────────────────────────────────────
// Max 10 orders per IP per 10 minutes — prevents bot flooding
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { message: "Too many orders from this IP. Please wait a few minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── User routes ────────────────────────────────────────────────────────────────

// Create order — guest or logged-in user, always rate limited
router.post("/create", orderLimiter, createOrder);

// Get logged-in user's own orders — requires auth
router.get("/my-orders", authMiddleware, getMyOrders);

// ── Admin routes ───────────────────────────────────────────────────────────────

// Get all orders (paginated)
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

// Get single order
router.get("/:id", authMiddleware, adminMiddleware, getOrderById);

// Update order status (also restores stock on cancellation)
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

// Update payment status
router.put("/:id/payment", authMiddleware, adminMiddleware, updatePaymentStatus);

module.exports = router;