const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      default: 0
    },
    ingredients: {
      type: [String]
    },
    benefits: {
      type: [String]
    },
    imageUrl: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    allowCOD: {
    type: Boolean,
    default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
