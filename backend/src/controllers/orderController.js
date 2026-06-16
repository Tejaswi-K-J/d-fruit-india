const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

/**
 * @desc    Create new order (User / Guest)
 * @route   POST /api/orders/create
 * @access  Public (guest supported) — rate limited at route level
 */
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { products: cartItems, paymentMethod, address } = req.body;

    // ── Basic input checks ─────────────────────────────────────────────────────
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "No products in order" });
    }

    if (!paymentMethod) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Payment method is required" });
    }

    if (!address || !address.street || !address.city || !address.phone) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Complete delivery address is required" });
    }

    // ── Validate products + recompute price server-side ────────────────────────
    const orderProducts = [];
    let serverTotal = 0;

    for (const item of cartItems) {
      // Validate productId shape before hitting DB
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Invalid product ID: ${item.productId}` });
      }

      const quantity = parseInt(item.quantity, 10);
      if (!quantity || quantity < 1) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }

      // Fetch live product from DB — never trust client price
      const product = await Product.findById(item.productId).session(session);

      if (!product || !product.isActive) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Product not found or no longer available: ${item.productId}`,
        });
      }

      // COD check
      if (paymentMethod === "COD" && !product.allowCOD) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Cash on Delivery is not available for "${product.name}"`,
        });
      }

      // Stock check
      if (product.stock < quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Only ${product.stock} unit(s) of "${product.name}" available`,
        });
      }

      // Decrement stock atomically inside the transaction
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -quantity } },
        { session }
      );

      serverTotal += product.price * quantity;

      orderProducts.push({
        productId: product._id,
        name: product.name,
        price: product.price,   // always DB price, never client price
        quantity,
      });
    }

    // ── Create the order ───────────────────────────────────────────────────────
    const order = new Order({
      userId: req.user?.id || null,
      products: orderProducts,
      totalAmount: serverTotal,        // server-computed, never from client
      paymentMethod: paymentMethod.toUpperCase(),
      paymentStatus: "PENDING",
      address,
    });

    await order.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("[createOrder]", error.message);
    res.status(500).json({ message: "Order creation failed. Please try again." });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Get logged-in user's own orders
 * @route   GET /api/orders/my-orders
 * @access  Private (user)
 */
exports.getMyOrders = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("products.productId", "name imageUrl"),
      Order.countDocuments({ userId: req.user.id }),
    ]);

    res.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[getMyOrders]", error.message);
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

/* ================= ADMIN ROUTES ================= */

/**
 * @desc    Get all orders (Admin) with pagination
 * @route   GET /api/orders?page=1&limit=20
 * @access  Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(),
    ]);

    res.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[getAllOrders]", error.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * @desc    Get single order by ID (Admin)
 * @route   GET /api/orders/:id
 * @access  Admin
 */
exports.getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("products.productId", "name imageUrl");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("[getOrderById]", error.message);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Admin
 */
exports.updateOrderStatus = async (req, res) => {
  const VALID_STATUSES = ["PLACED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];
  const { orderStatus } = req.body;

  if (!orderStatus || !VALID_STATUSES.includes(orderStatus)) {
    return res.status(400).json({
      message: `orderStatus must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // If cancelling a previously placed order, restore stock
    if (orderStatus === "CANCELLED" && order.orderStatus !== "CANCELLED") {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("[updateOrderStatus]", error.message);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

/**
 * @desc    Update payment status (Admin)
 * @route   PUT /api/orders/:id/payment
 * @access  Admin
 */
exports.updatePaymentStatus = async (req, res) => {
  const VALID_PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"];
  const { paymentStatus, paymentId } = req.body;

  if (!paymentStatus || !VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
    return res.status(400).json({
      message: `paymentStatus must be one of: ${VALID_PAYMENT_STATUSES.join(", ")}`,
    });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = paymentStatus;
    if (paymentId) order.paymentGatewayPaymentId = paymentId;

    await order.save();

    res.json({ message: "Payment status updated", order });
  } catch (error) {
    console.error("[updatePaymentStatus]", error.message);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};