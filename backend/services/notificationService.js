const Notification = require("../models/Notification");

// Single user notification
exports.createNotification = async ({ userId, title, message, type }) => {
  return await Notification.create({
    userId,
    title,
    message,
    type,
  });
};

// Multiple users notification
exports.createBulkNotifications = async (userIds, data) => {
  const notifications = userIds.map((id) => ({
    userId: id,
    ...data,
  }));

  return await Notification.insertMany(notifications);
};
