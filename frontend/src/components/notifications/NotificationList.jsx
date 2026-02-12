import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications = [], onRead }) {
  // Ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications)
    ? notifications
    : [];

  if (safeNotifications.length === 0) {
    return <p>No notifications 🔔</p>;
  }

  return (
    <div>
      {safeNotifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onRead={onRead}
        />
      ))}
    </div>
  );
}
