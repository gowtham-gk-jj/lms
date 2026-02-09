import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications, onRead }) {
  if (!notifications.length) {
    return <p>No notifications 🔔</p>;
  }

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onRead={onRead}
        />
      ))}
    </div>
  );
}
