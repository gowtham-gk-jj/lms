const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markNotificationAsRead,
  createNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// GET notifications
router.get("/", protect, getMyNotifications);

// CREATE notification (Postman testing)
router.post("/", protect, createNotification);

// MARK notification as read
router.put("/:id/read", protect, markNotificationAsRead);

module.exports = router;
