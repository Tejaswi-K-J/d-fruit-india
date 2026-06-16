const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Helper: return a safe user object (never expose password hash)
const safeUser = (doc) => ({
  _id: doc._id,
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  role: doc.role,
  createdAt: doc.createdAt,
});

/* ================= USER AUTH ================= */

// User Signup
exports.userRegister = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // 12 rounds (stronger than 10)

    const user = await User.create({ name, email, phone, password: hashedPassword });

    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({ token, user: safeUser(user) });
  } catch (error) {
    console.error("[userRegister]", error.message);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use .select("+password") in case password is ever hidden by default in the schema
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // Same message for both "not found" and "wrong password" — prevents user enumeration
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.json({ token, user: safeUser(user) });
  } catch (error) {
    console.error("[userLogin]", error.message);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

/* ================= ADMIN AUTH ================= */

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ id: admin._id, role: admin.role });

    res.json({
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("[adminLogin]", error.message);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};