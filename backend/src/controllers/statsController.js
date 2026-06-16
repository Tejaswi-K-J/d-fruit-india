const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const ContactMessage = require("../models/ContactMessage");
const User = require("../models/User");

/**
 * @desc    Get dashboard summary stats (Admin)
 * @route   GET /api/stats
 * @access  Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // All counts run in parallel — single round-trip cost instead of 5
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalMessages,
      totalUsers,
      pendingOrders,
      revenueResult,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      Order.countDocuments(),
      ContactMessage.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ["PLACED", "PACKED"] } }),
      // Sum totalAmount only for PAID orders
      Order.aggregate([
        { $match: { paymentStatus: "PAID" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalMessages,
      totalUsers,
      pendingOrders,   // orders needing attention (PLACED or PACKED)
      totalRevenue,    // sum of all PAID order amounts
    });
  } catch (error) {
    console.error("[getDashboardStats]", error.message);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};