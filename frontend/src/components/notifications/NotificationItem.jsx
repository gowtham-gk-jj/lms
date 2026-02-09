export default function NotificationItem({ notification, onRead }) {
  return (
    <div
      className={`notification-card ${
        notification.isRead ? "read" : "unread"
      }`}
    >
      <h4>{notification.title}</h4>
      <p>{notification.message}</p>
      <small>{new Date(notification.createdAt).toLocaleString()}</small>

      {!notification.isRead && (
        <button onClick={() => onRead(notification._id)}>
          Mark as Read
        </button>
      )}
    </div>
  );
}
