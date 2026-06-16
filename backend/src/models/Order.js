const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // allow guest checkout
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        name: String,
        price: Number,
        quantity: Number
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["CARD", "UPI", "COD"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING"
    },

    orderStatus: {
      type: String,
      enum: ["PLACED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED"
    },

    // 🔐 Payment gateway references (safe to store)
    paymentGatewayOrderId: {
      type: String
    },
    paymentGatewayPaymentId: {
      type: String
    },

    address: {
      name: String,
      phone: String,
      street: String,
      city: String,
      pincode: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
