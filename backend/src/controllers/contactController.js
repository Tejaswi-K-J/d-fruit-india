const ContactMessage = require("../models/ContactMessage");
const mongoose = require("mongoose");

/**
 * @desc    Create new contact message (Public)
 * @route   POST /api/contact
 */
exports.createMessage = async (req, res) => {
  try {
    const name    = req.body.name?.trim();
    const phone   = req.body.phone?.trim();
    const message = req.body.message?.trim();

    // ── Validation ─────────────────────────────────────────────────────────────
    if (!name || !phone || !message) {
      return res.status(400).json({ message: "Name, phone, and message are all required" });
    }
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ message: "Name must be between 2 and 100 characters" });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });
    }
    if (message.length < 10 || message.length > 1000) {
      return res.status(400).json({ message: "Message must be between 10 and 1000 characters" });
    }

    const newMessage = await ContactMessage.create({ name, phone, message });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("[createMessage]", error.message);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/**
 * @desc    Get all messages (Admin) — paginated
 * @route   GET /api/contact?page=1&limit=20
 */
exports.getMessages = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ContactMessage.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ContactMessage.countDocuments(),
    ]);

    res.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[getMessages]", error.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/**
 * @desc    Delete message permanently (Admin)
 * @route   DELETE /api/contact/:id
 */
exports.deleteMessage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted permanently" });
  } catch (error) {
    console.error("[deleteMessage]", error.message);
    res.status(500).json({ message: "Failed to delete message" });
  }
};