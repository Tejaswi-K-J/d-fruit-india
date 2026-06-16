require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Category = require("../models/Category");

const categories = [
  "Snacks & Energy Boosters",
  "Sweets & Desserts",
  "Nutrition Powders",
  "Dry Fruits & Seeds",
  "Health Drinks",
  "Ayurvedic Products",
  "Organic Foods",
];

// helper to generate slug
const makeSlug = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const seedCategories = async () => {
  try {
    await connectDB();
    console.log(" Connected DB:", mongoose.connection.name);

    for (const name of categories) {
      const slug = makeSlug(name);

      const exists = await Category.findOne({
        $or: [{ name }, { slug }],
      });

      if (!exists) {
        await Category.create({
          name,
          slug,
          isActive: true,
        });
        console.log(`Added category: ${name}`);
      } else {
        console.log(`Category already exists: ${name}`);
      }
    }

    console.log("Category seeding completed");
    process.exit();
  } catch (error) {
    console.error("Error seeding categories:", error.message);
    process.exit(1);
  }
};

seedCategories();
