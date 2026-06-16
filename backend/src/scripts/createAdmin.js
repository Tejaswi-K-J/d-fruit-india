const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("../models/Admin");

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const newPassword = "Admin@123";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Admin.findOneAndUpdate(
      { email: "admin@dfruitindia.com" },
      { password: hashedPassword },
      { upsert: true }
    );

    console.log("Admin password reset to Admin@123");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

resetAdminPassword();
