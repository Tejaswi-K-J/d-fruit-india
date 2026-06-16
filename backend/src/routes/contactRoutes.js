const express = require("express");
const router = express.Router();

const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/contactController");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Public — user sends message
router.post("/", createMessage);

// Admin — view all messages
router.get("/", authMiddleware, adminMiddleware, getMessages);

// Admin — delete message
router.delete("/:id", authMiddleware, adminMiddleware, deleteMessage);

module.exports = router;
