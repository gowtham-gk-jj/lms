const Notification = require("../models/Notification");

// ===============================
// GET logged-in user's notifications
// ===============================
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// ===============================
// MARK notification as read
// ===============================
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

// ===============================
// CREATE notification (FOR POSTMAN TEST)
// ===============================
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({
        message: "title, message, and type are required",
      });
    }

    const notification = await Notification.create({
      userId: req.user._id, // 🔥 logged-in user
      title,
      message,
      type,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ message: "Failed to create notification" });
  }
};
